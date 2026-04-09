type Props = {
    onConfirm: () => void
    onCancel: () => void
  }
  
  export default function DeleteTaskModal({ onConfirm, onCancel }: Props) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>Are you sure you want to delete this task?</p>
          <div className="modal-buttons">
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }