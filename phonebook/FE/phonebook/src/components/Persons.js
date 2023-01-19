const Number = ({id, name, number, delFn}) => 
<li>
  {name} {number} &nbsp;
  <button id={id} name={name} onClick={delFn}>delete</button>  
</li>

const Persons = ({persons, nameFilter, delFn}) => 
<ul>
  {persons
    .filter(x => x.name.toLowerCase().includes(nameFilter.toLowerCase()))
    .map(x => <Number key={x.id} id={x.id} name={x.name} number={x.number} delFn={delFn}/>)
  }
</ul>

export default Persons