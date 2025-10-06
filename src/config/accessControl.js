const defaultRules = {};

const adminRules = {
  'users_single_create': 'EFFECT_ALLOW',
  'users_bulk_upload': 'EFFECT_ALLOW',
  'users_template': 'EFFECT_ALLOW',
  'users_export': 'EFFECT_ALLOW',
  
  'aircrafts_template': 'EFFECT_ALLOW',
  'aircrafts_bulk_upload': 'EFFECT_ALLOW',
  'aircrafts_export': 'EFFECT_ALLOW',

  'products_template': 'EFFECT_ALLOW',
  'products_bulk_upload': 'EFFECT_ALLOW',
  'products_export': 'EFFECT_ALLOW',

  'airports_template': 'EFFECT_ALLOW',
  'airports_bulk_upload': 'EFFECT_ALLOW',
  'airports_export': 'EFFECT_ALLOW',
  
  'user_roles_template': 'EFFECT_ALLOW',
  'user_roles_bulk_upload': 'EFFECT_ALLOW',
  'user_roles_export': 'EFFECT_ALLOW',
  
  'user_categories_template': 'EFFECT_ALLOW',
  'user_categories_bulk_upload': 'EFFECT_ALLOW',
  'user_categories_export': 'EFFECT_ALLOW',
  
  'product_categories_template': 'EFFECT_ALLOW',
  'product_categories_bulk_upload': 'EFFECT_ALLOW',
  'product_categories_export': 'EFFECT_ALLOW',

  'return_reasons_template': 'EFFECT_ALLOW',
  'return_reasons_bulk_upload': 'EFFECT_ALLOW',
  'return_reasons_export': 'EFFECT_ALLOW',

  'payment_exception_reasons_template': 'EFFECT_ALLOW',
  'payment_exception_reasons_bulk_upload': 'EFFECT_ALLOW',
  'payment_exception_reasons_export': 'EFFECT_ALLOW',
}

export const rulesForUserRoles = (role) => {
  // role has spaces betwerrn them. example: Super Admin. Normalizing them without any spaces
  switch (role?.replace(" ","").toUpperCase()) {
    case 'ADMIN':
      return {
        ...adminRules,
      }
    case 'SUPERVISOR':
      return {
        ...adminRules,
      }
    case 'SUPERADMIN':
      return {
        ...adminRules,
      }
    default:
      return defaultRules
  }
}