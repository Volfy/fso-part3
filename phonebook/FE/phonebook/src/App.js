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

    // some validation
    if(!newName || !newNumber) {
      alert('Missing Values')
      return
    }

    // Duplicate Numbers should be fine.
    // will add duplicate names in case one browser adds
    // a new name and the other also adds before the prior updates.
    // the check if unique is ONLY in the frontend.
    // running setPersons() in getAll() again doesn't change anything
    const isUnique = !persons.filter(p => p.name.toLowerCase() === newName.toLowerCase()).length 

    const Person = {
      name: newName,
      number: newNumber,
    }

    if (isUnique){

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
    } else {
      const oldPerson = persons.filter(p => p.name.toLowerCase() === newName.toLowerCase())[0]
      // using the old name means case changes won't update. 
      Person.name = oldPerson.name
      const id = oldPerson.id
      if (window.confirm(`${Person.name} is already in the phonebook. 
Replace the old number with the new one?`)) {
        phServ
          .update(id, Person)
          .then(data => {
            setPersons(persons.map(p => p.id != id ? p : data))
            setNewName('')
            setNewNumber('')
            setNotifMessage({
              message: `Updated ${newName}`,
              isError: false
            })
            setTimeout(() => setNotifMessage({message: null, isError: false}), 4000)
          })
          .catch(error => {
            phServ
            .getAll()
            .then(data => setPersons(data))
            setNotifMessage({
            message: `${newName} cannot be updated, has been deleted from server`,
            isError: true
          })
          setTimeout(() => setNotifMessage({message: null, isError: false}), 4000)
          })
      }
    }
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