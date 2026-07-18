import { adminApiClient } from '@/api/ky-client'

const ADMIN_SESSIONS_PATH = 'admins/identities/admins/sessions'

export const adminSessionsApi = {
  /**
   * Creates an admin session (login).
   * @param {Object} session - Login credentials
   * @param {string} session.email - Admin email address
   * @param {string} session.password - Admin password
   * @returns {Promise<Object>} Authenticated identities admin
   */
  create: (session) => {
    const payload = {
      email    : session.email,
      password : session.password
    }

    return adminApiClient.post(ADMIN_SESSIONS_PATH, { json: payload }).json()
  },

  /**
   * Fetches the current admin session (also used for token refresh).
   * @returns {Promise<Object>} Current identities admin
   */
  current: () => adminApiClient.get(`${ADMIN_SESSIONS_PATH}/current`).json(),

  /**
   * Destroys the current admin session (logout).
   * @returns {Promise<Object>} Logout confirmation message
   */
  destroy: () => adminApiClient.delete(ADMIN_SESSIONS_PATH).json()
}
