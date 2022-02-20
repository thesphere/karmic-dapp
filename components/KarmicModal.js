import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const KarmicModal = ({
  title = 'Modal Title',
  description = 'Some amazing description about the modal',
  action = () => console.log('Karmic Modal action'),
  actionName = 'Some Action',
  actionProgressName = 'Performing...',
  show,
  handleClose,
  children,
}) => {
  const [inProgress, setInProgress] = useState(false)

  const performAction = async () => {
    try {
      setInProgress(true)
      await action()
      setInProgress(false)
    } catch (error) {
      console.error(error)
      setInProgress(false)
    }
  }
  return (
    <Modal
      contentClassName="bg-transparent"
      show={show}
      onHide={handleClose}
      animation={true}
      centered
    >
      <Modal.Body className="karmic-modal-container">
        <h3 className="karmic-modal-title">{title}</h3>
        <p className="karmic-modal-description">{description}</p>
        {children}
        <div className="karmic-modal-body">
          <Button
            className="karmic-modal-action action-hover"
            variant="primary"
            onClick={performAction}
          >
            {inProgress ? actionProgressName : actionName}
          </Button>
        </div>
        <Button
          className="karmic-modal-close"
          variant="link"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default KarmicModal
