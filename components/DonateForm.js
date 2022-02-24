import { formatUnits } from 'ethers/lib/utils'
import { Form, Row, Col } from 'react-bootstrap'

const DonateForm = ({ title, balance }) => {
  return (
    <div className="support-form-container" style={{textAlign: 'center'}}>
        <h3 className='donate-form-title'>{title}</h3>
      <Form.Group
        style={{ justifyContent: 'space-between', textAlign: 'left' }}
        as={Row}
        controlId="formPlaintextPassword"
      >
        <Form.Label className="support-form-label" column sm="4">
          Donate ETH
        </Form.Label>
        <Col sm="6">
          <Form.Control
          style={{textAlign: 'right'}}
            plaintext
            readOnly
            value={
                !(Number(balance) === undefined || Number(balance) === '')
                  ? `${Number(balance)/1000} ETH`
                  : '0 ETH'
              }
          />
        </Col>
      </Form.Group>
      <Form.Group
        style={{ justifyContent: 'space-between', textAlign: 'left'  }}
        as={Row}
        controlId="formPlaintextPassword"
      >
        <Form.Label className="support-form-label" column sm="5">
          Claim KARMIC Tokens
        </Form.Label>
        <Col sm="6">
          <Form.Control
          style={{textAlign: 'right'}}
            plaintext
            readOnly
            value={
              !(balance === undefined || balance === '')
                ? `${balance} KARMIC`
                : '0 KARMIC'
            }
          />
        </Col>
      </Form.Group>
    </div>
  )
}

export default DonateForm
