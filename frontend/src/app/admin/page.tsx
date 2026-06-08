import BookingRequestCard from "@/components/BookingRequestCard";
import NavBar from "@/components/NavBar";

const page = () => {
  return (
    <div className="min-h-screen overflow-y-auto mb-10">
      <NavBar text="ITMO Admin" />
      <main className="px-6">
        <p className="py-6 text-4xl font-semibold tracking-wide">Dashboard</p>
        <div className="grid grid-cols-2 w-full gap-4">
          <div className="p-4 bg-green-400 rounded-xl text-2xl font-medium pl-6">
            Available
            <p className="text-5xl mt-2">5</p>
          </div>
          <div className="p-4 bg-red-400 rounded-xl text-2xl font-medium pl-6">
            Available
            <p className="text-5xl mt-2">5</p>
          </div>
          <div className="p-4 bg-yellow-400 rounded-xl text-2xl font-medium pl-6">
            Available
            <p className="text-5xl mt-2">5</p>
          </div>
          <div className="p-4 bg-blue-400 rounded-xl text-2xl font-medium pl-6">
            Available
            <p className="text-5xl mt-2">5</p>
          </div>
        </div>

        <p className="py-6 text-4xl font-semibold tracking-wide">
          Booking Requests
        </p>

        <div className="border-2 rounded-t-4xl border-b-0 shadow-xl">
          <BookingRequestCard
            name={"David Idowu"}
            purpose="read"
            status="occupied"
            deskNumber="DESK 4"
          />
        </div>
      </main>
    </div>
  );
};

export default page;
