const Filter = ({nameFilter, handleChange, setNameFilter}) => 
<form>
  filter numbers by name:&nbsp;
    <input value={nameFilter} onChange={(event) => 
    handleChange(event, setNameFilter)}/>
</form>

export default Filter