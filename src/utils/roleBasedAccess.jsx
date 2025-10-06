/* eslint-disable react/prop-types */
import { rulesForUserRoles } from '../config/accessControl'

export const isAllowed = (role, action_id) => {
  const data = rulesForUserRoles(role)
  return data[action_id] === 'EFFECT_ALLOW'
}

export const CheckAllowed = ({ currentUser, action, children }) => {
  return isAllowed(currentUser, action) && <>{children}</>
}
