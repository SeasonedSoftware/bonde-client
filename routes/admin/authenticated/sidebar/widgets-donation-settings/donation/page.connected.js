import { connect } from 'react-redux'
import { donationForm, DonationSettingsForm } from '~client/mobrender/widgets/donations'
import MobSelectors from '~client/mobrender/redux/selectors'
import * as MobActions from '~client/mobrender/redux/action-creators'

const mapStateToProps = state => {
  const selectors = MobSelectors(state)

  return {
    mobilization: selectors.getMobilization(),
    widget: selectors.getWidget()
  }
}

const mapDispatchToProps = {
  asyncWidgetUpdate: MobActions.asyncUpdateWidget
}

export default connect(mapStateToProps, mapDispatchToProps)(
  donationForm(DonationSettingsForm)
)
