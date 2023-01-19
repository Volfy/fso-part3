const PersonForm = ({addPerson, newName, newNumber, setNewName, setNewNumber, handleChange}) => {
    
    return (
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(event) => 
            handleChange(event, setNewName)}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => 
            handleChange(event, setNewNumber)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

export default PersonForm