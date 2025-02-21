import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useParams, useNavigate } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useState } from "react";
import { requireUser } from "~/lib/auth.server";
import { supabase } from "~/lib/supabase.server";
import { calculateAvailableTimeSlots, createBooking } from "~/models/booking.server";
import Calendar from "~/components/booking/Calendar";
import ServiceSelector from "~/components/booking/ServiceSelector";
import BookingSteps from "~/components/booking/BookingSteps";
import CustomerDetailsForm from "~/components/booking/CustomerDetailsForm";
import BookingSummary from "~/components/booking/BookingSummary";
import PaymentSection from "~/components/booking/PaymentSection";
import type { TimeSlot } from "~/types/booking";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const url = new URL(request.url);
  const date = url.searchParams.get("date")
    ? new Date(url.searchParams.get("date")!)
    : new Date();

  const { vendorId } = params;
  
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("vendor_id", vendorId)
    .eq("is_visible", true)
    .order("order_index");

  const timeSlots = await calculateAvailableTimeSlots({
    vendorId,
    serviceIds: [],
    date,
  });

  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return json({ services, timeSlots, date: date.toISOString(), userData });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  
  const bookingData = {
    vendorId: formData.get("vendorId") as string,
    services: formData.getAll("services[]") as string[],
    startTime: formData.get("startTime") as string,
    notes: formData.get("notes") as string,
    customerDetails: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }
  };

  await createBooking(bookingData, user.id);
  return redirect("/bookings");
};

export default function BookingPage() {
  const { services, timeSlots: initialTimeSlots, date, userData } = useLoaderData<typeof loader>();
  const params = useParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>();
  const [currentDate, setCurrentDate] = useState(new Date(date));
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
  });

  const handleDateChange = async (newDate: Date) => {
    setCurrentDate(newDate);
    const newTimeSlots = await calculateAvailableTimeSlots({
      vendorId: params.vendorId!,
      serviceIds: selectedServices,
      date: newDate,
    });
    setTimeSlots(newTimeSlots);
  };

  const handleServiceSelect = async (serviceIds: string[]) => {
    setSelectedServices(serviceIds);
    const newTimeSlots = await calculateAvailableTimeSlots({
      vendorId: params.vendorId!,
      serviceIds,
      date: currentDate,
    });
    setTimeSlots(newTimeSlots);
  };

  const handleCustomerDetailsSubmit = (data: any) => {
    setCustomerDetails(data);
    setCurrentStep(4);
  };

  const handlePaymentComplete = () => {
    // Here you would typically integrate with a payment provider
    // For now, we'll just simulate a successful payment
    navigate("/bookings");
  };

  const totalPrice = services
    .filter(service => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelector
            services={services}
            selectedServices={selectedServices}
            onServiceSelect={(services) => {
              handleServiceSelect(services);
              if (services.length > 0) setCurrentStep(2);
            }}
          />
        );
      case 2:
        return (
          <Calendar
            date={currentDate}
            timeSlots={timeSlots}
            selectedSlot={selectedSlot}
            onDateChange={handleDateChange}
            onSlotSelect={(slot) => {
              setSelectedSlot(slot);
              setCurrentStep(3);
            }}
          />
        );
      case 3:
        return (
          <CustomerDetailsForm
            defaultValues={customerDetails}
            onSubmit={handleCustomerDetailsSubmit}
          />
        );
      case 4:
        return (
          <BookingSummary
            services={services}
            selectedServices={selectedServices}
            selectedSlot={selectedSlot}
            customerDetails={customerDetails}
          />
        );
      case 5:
        return (
          <PaymentSection
            amount={totalPrice}
            onPaymentComplete={handlePaymentComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Varaa aika</h1>
        
        <div className="mt-8">
          <BookingSteps currentStep={currentStep} />
        </div>

        <div className="mt-8">
          {renderCurrentStep()}
        </div>

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edellinen
            </button>
          )}
          
          {currentStep === 4 && (
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Siirry maksamaan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
