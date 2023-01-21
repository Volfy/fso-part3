import { useState, useEffect } from 'react'
import phServ from './services/phones'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState({message: null, isError: false})
  
  const handleChange = (event, setFn) => {
    setFn(event.target.value)
  }
  
  const handleDelete = event => {
    const name = event.target.getAttribute('name')

    if(window.confirm(`Are you sure you want to delete ${name}?`)) {
      const id = event.target.getAttribute('id')
      phServ
        .remove(id)
        .then(r => {
          setPersons(persons.filter(p => p.id != id))
          setNewName('')
          setNewNumber('')
          setNotifMessage({
            message: `Deleted ${name}`,
            isError: false
          })
          setTimeout(() => setNotifMessage({message: null, isError: false}), 2000)
        })
        .catch(error => {
          phServ
            .getAll()
            .then(data => setPersons(data))
          setNewName('')
          setNewNumber('')
          setNotifMessage({
            message: `${name} already deleted from server`,
            isError: true
          })
          setTimeout(() => setNotifMessage({message: null, isError: false}), 4000)
        })
    }
  }

  useEffect(() => {
    phServ
      .getAll()
      .then(data => setPersons(data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const Person = {
      name: newName,
      number: newNumber,
    }

    phServ
      .addNew(Person)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
        setNotifMessage({
          message: `Added ${newName}`,
          isError: false
        })
        setTimeout(() => setNotifMessage({message: null, isError: false}), 4000)
      })  
    }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notifMessage.message} isError={notifMessage.isError} />
      <Filter 
        nameFilter={nameFilter} 
        setNameFilter={setNameFilter} 
        handleChange={handleChange}
      />
      <h2>Add New Contact</h2>
      <PersonForm 
        persons={persons}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setPersons={setPersons}
        handleChange={handleChange}
        addPerson={addPerson}
      />
      <h2>Contact List</h2>
      <Persons 
        persons={persons} 
        nameFilter={nameFilter}
        delFn={handleDelete}
      />
    </div>
  )
}

export default App