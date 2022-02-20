import CTACard from './CTACard'
import useModal from './utils/useModal'
import KarmicModal from './KarmicModal'
import { parseUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import SupportForm from './SupportForm'

const CTA = ({
  handleClaim,
  approveAllTokens,
  supportSphere,
  tokens,
  claimableTokens,
  approvedTokens,
  govTokenBalances,
}) => {
  const {
    show: showClaim,
    handleShow: handleShowClaim,
    handleClose: handleClaimClose,
  } = useModal(false)
  const {
    show: showSupport,
    handleShow: handleSupportShow,
    handleClose: handleSupportClose,
  } = useModal(false)
  const {
    show: showApprove,
    handleShow: handleApproveShow,
    handleClose: handleApproveClose,
  } = useModal(false)

  const [supportValue, setSupportValue] = useState(0)

  const handleSupportValue = (e) => setSupportValue(e.target.value)

  return (
    <div className="cta-deck">
      {claimableTokens.length > 0 ? (
        <>
          {claimableTokens.length == approvedTokens.length && (
            <CTACard
              title="Claim Governance Token"
              description="Approve and claim all of the governance torkens from the crowdunds that met their funding target."
              actionName="Claim All KARMIC tokens"
              action={handleShowClaim}
            />
          )}
          {claimableTokens.length != approvedTokens.length && (
            <CTACard
              title="Claim Governance Token"
              description="Approve and claim all of the governance torkens from the crowdunds that met their funding target."
              actionName="Approve All KARMIC  Tokens"
              action={handleApproveShow}
            />
          )}
        </>
      ) : govTokenBalances.find((balance) => balance > 0) ? null : null}
      <CTACard
        title="Support Sphere"
        description="Support Sphere Commons Pool and receive KARMIC governance tokens to influence decision making in the DAO"
        actionName="Support Sphere "
        action={handleSupportShow}
      />
      <KarmicModal
        show={showClaim}
        handleClose={handleClaimClose}
        title={'Claim All Governance Tokens'}
        description={
          'Claim all of the governance tokens from the crowdunds that met their funding target.'
        }
        actionName={'Claim Tokens'}
        actionProgressName={'Claiming...'}
        action={handleClaim}
      />
      <KarmicModal
        show={showApprove}
        handleClose={handleApproveClose}
        title={'Approve Box tokens'}
        description={
          'Approve and claim your KARMIC tokens from the crowdunds that met their funding target.'
        }
        actionName={'Aprove'}
        actionProgressName={'Approving...'}
        action={approveAllTokens}
      />
      <KarmicModal
        show={showSupport}
        handleClose={handleSupportClose}
        title={'SUPPORT SPHERE'}
        description={'Support Sphere with ETH and receive KARMIC Tokens'}
        actionName={'Send ETH to receive KARMIC'}
        actionProgressName={'Supporting...'}
        action={() => supportSphere(parseUnits(supportValue, 18))}
      >
        <SupportForm value={supportValue} setValue={handleSupportValue} />
      </KarmicModal>
    </div>
  )
}

export default CTA
