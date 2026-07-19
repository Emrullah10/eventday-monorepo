export const makeFindUserById = ({ userRepo }) => (id) => userRepo.findById(id);
