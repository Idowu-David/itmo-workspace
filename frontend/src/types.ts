export type DeskStatus = "available" | "booked" | "hold";
export interface IBooking {
  _id: string;
  deskId: string;
  userId: string;

  name: string;
  purpose: string;
  phoneNumber: string;
  proofOfWork: string;

  status:
    | "pending"
    | "approved"
    | "rejected"
    | "checked-in"
    | "expired"
    | "cancelled";

  approvedAt?: Date;
}
