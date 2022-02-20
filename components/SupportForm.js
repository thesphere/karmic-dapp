import { formatUnits } from 'ethers/lib/utils'
import { Form, Row, Col } from 'react-bootstrap'

const SupportForm = ({value, setValue}) => {
  return (
    <div className='support-form-container'>
      <Form.Group style={{justifyContent: 'space-between'}} as={Row} controlId="formPlaintextPassword">
        <Form.Label className='support-form-label' column sm="4">
        Send ETH
        </Form.Label>
        <Col sm="6">
          <Form.Control className='support-form-input' onChange={setValue} type="text" placeholder="1.25" />
        </Col>
      </Form.Group>
      <Form.Group style={{justifyContent: 'space-between'}} as={Row} controlId="formPlaintextPassword">
        <Form.Label className='support-form-label' column sm="5">
        Receive KARMIC
        </Form.Label>
        <Col sm="6">
          <Form.Control plaintext readOnly value={!(value===undefined || value==='')?`${value} KARMIC`: "0 KARMIC"} />
        </Col>
      </Form.Group>
    </div>
  )
}

export default SupportForm
