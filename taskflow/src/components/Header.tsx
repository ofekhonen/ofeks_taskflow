type Props = {
    searchTerm: string
    setSearchTerm: (value: string) => void
    onAdd: () => void
  }
  
  export default function Header({ searchTerm, setSearchTerm, onAdd }: Props) {
    return (
      <div className="header">
        <h1>TaskFlow</h1>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="fab-btn" onClick={onAdd}>+</button>
      </div>
    )
  }