export const makeGetUserTickets = ({ bookingRepo }) => (userId) => bookingRepo.findUserTickets(userId);
