export const makeListEvents = ({ eventRepo }) => (filters) => eventRepo.findAll(filters);
