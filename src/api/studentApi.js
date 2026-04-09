import axios from "axios";

const BASE_URL = "http://localhost:8081/students";

export const getStudents = () => axios.get(BASE_URL);

export const addStudent = (student) => axios.post(BASE_URL, student);

export const deleteStudent = (id) => axios.delete(`${BASE_URL}/${id}`);