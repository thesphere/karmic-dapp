import Button from './Button'

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
        <Button classNames="cta-action" text={actionName} action={action} />
      </div>
    </div>
  )
}

export default CTACard
