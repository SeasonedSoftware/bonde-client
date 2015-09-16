import { createFormReducer } from 'redux-form'
import { combineReducers } from 'redux'
import mobilizations from './../../app/scripts/reducers/mobilizations'
import blocks from './../../app/scripts/reducers/blocks'
import widgets from './../../app/scripts/reducers/widgets'
import auth from './../../app/scripts/reducers/auth'

const mobilizationBasics = createFormReducer('mobilizationBasics', ['name', 'goal'])
const mobilizationCity = createFormReducer('mobilizationCity', ['colorScheme'])
const mobilizationAnalytics = createFormReducer('mobilizationAnalytics', ['id'])
const mobilizationFonts = createFormReducer('mobilizationFonts', ['headerFont', 'bodyFont'])
const loginForm = createFormReducer('loginForm', ['email', 'password'])
const widgetForm = createFormReducer('widgetForm', ['callToAction', 'buttonText', 'countText', 'emailText'])

const mobilizationSharing = createFormReducer('mobilizationSharing', [
  'facebook_share_title',
  'facebook_share_description',
  'facebook_share_image'
])

export default combineReducers({
  mobilizations,
  mobilizationBasics,
  mobilizationCity,
  mobilizationAnalytics,
  mobilizationFonts,
  mobilizationSharing,
  blocks,
  widgets,
  loginForm,
  widgetForm,
  auth
})
