import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;

// export const updateModule = async (module: any) => {
//     console.log(`Updating module with ID: ${module._id}`);
//     console.log(`URL: ${MODULES_API}/${module._id}`);
//     const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
//     return data;
//   };


  export const updateModule = async (module: any) => {
    const { data } = await axiosWithCredentials.put(
      `${MODULES_API}/${module._id}`,
      module
    );
    return data;
   };
   
  
// export const deleteModule = async (moduleId: string) => {
//  const response = await axios.delete(`${MODULES_API}/${moduleId}`);
//  return response.data; };

 export const deleteModule = async (moduleId: string) => {
  const response = await axiosWithCredentials.delete(
    `${MODULES_API}/${moduleId}`
  );
  return response.data;
 };
 