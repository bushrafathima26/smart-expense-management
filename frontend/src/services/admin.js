import api from "./api";

export const resetData = () => {
  return api.delete("admin/reset/");
};
