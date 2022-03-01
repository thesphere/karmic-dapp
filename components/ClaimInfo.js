import { formatUnits } from 'ethers/lib/utils'
import { Form, Row, Col } from 'react-bootstrap'

const ClaimInfo = ({ tokens }) => {
  const totalClaimable = () => {
    return tokens
      .filter((token) => token?.isTargetReached && Number(token.balance) > 0)
      ?.reduce((prevValue, token) => prevValue + Number(token?.balance), 0)
  }
  const renderClaimTokenInfo = () => {
    const filteredToken = tokens.filter(
      (token) => token?.isTargetReached && token.balance > 0
    ) 
    return filteredToken?.map((token) => {
      return (
        <Form.Group
          style={{ justifyContent: 'space-between' }}
          as={Row}
          controlId="formPlaintextPassword"
        >
          <Form.Label className="support-form-label" column sm="6">
            {token?.title}
          </Form.Label>
          <Col sm="6">
            <Form.Control
              className="support-form-disabled-input"
              style={{ textAlign: 'right' }}
              plaintext
              readOnly
              value={`${Number(token?.balance)} KARMIC`}
            />
          </Col>
        </Form.Group>
      )
    })
  }
  return (
    <div className="support-form-container">
      {renderClaimTokenInfo()}
      <Form.Group
        style={{ justifyContent: 'space-between', textAlign: 'left' }}
        as={Row}
        controlId="formPlaintextPassword"
      >
        <Form.Label className="support-form-label" column sm="6">
          Total KARMIC Tokens
        </Form.Label>
        <Col sm="6">
          <Form.Control
            className="support-form-disabled-input"
            style={{ textAlign: 'right' }}
            plaintext
            readOnly
            value={`${parseFloat(totalClaimable()).toFixed(2)} KARMIC`}
          />
        </Col>
      </Form.Group>
    </div>
  )
}

export default ClaimInfo
