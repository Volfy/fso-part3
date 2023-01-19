import axios from 'axios' 
const baseUrl = 'http://localhost:3001/persons'

// crud
const getAll = () => axios.get(baseUrl).then(r => r.data)
const addNew = newPerson => axios.post(baseUrl, newPerson).then(r => r.data)
const update = (id, newPerson) => axios.put(`${baseUrl}/${id}`, newPerson).then(r => r.data)
const remove = id => axios.delete(`${baseUrl}/${id}`).then(r => r.data)



export default {getAll, addNew, remove, update}