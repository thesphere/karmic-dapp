import { Button } from 'react-bootstrap'

const CTACard = ({
  title = 'CTA Title',
  description = 'A good description for the CTA card',
  actionName = 'Test',
  action,
}) => {
  return (
    <div className="row text-center">
      <div className="col-12">
        <h3 className="cta-title">{title}</h3>
      </div>
      <div className="col-12">
        <p className="cta-description">{description}</p>
      </div>
      <div className="col-12">
        <Button
          className="cta-action sphere-action-Btn"
          variant="primary"
          type="button"
          onClick={action}
        >
          {actionName}
        </Button>
      </div>
    </div>
  )
}

export default CTACard
