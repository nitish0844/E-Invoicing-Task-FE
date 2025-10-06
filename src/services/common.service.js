import { apiCallProtected } from '../api/axios'
import {
  downloadAPICall,
  getAPICall,
  patchAPICall,
  postAPICall
} from './apiCall'

export const getSelectOptionsByTableName = ({ tableName, filters, search }) => {
  let url = `items/${tableName}?`
  if (filters) url += `&filters=${filters}`
  if (search) url += `&search=${search}`
  return getAPICall(url)
}

export const fileUploadAPI = ({ body, tableName = 'others' }) => {
  return postAPICall(`document-upload/${tableName}`, {
    body,
    headers: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}

export const bulkUploadAPI = ({
  body,
  returnErrorObject = false
}) => {
  return postAPICall(`upload`, {
    body,
    headers: { headers: { 'Content-Type': 'multipart/form-data' } },
    returnErrorObject
  })
}

export const getFileTemplate = async ({ tableName = 'users', fileName }) => {
  return downloadAPICall(`template/${tableName}`, { fileName })
}

export const exportTableDetails = ({
  source,
  search,
  type,
  filter,
  sort,
  fileType = 'xlsx'
}) => {
  let url = `download/${source}?file_type=${fileType}`
  if (search) url += `&search=${search}`
  if (filter && Object.entries(filter)?.filter(([_, value]) => value)?.length) {
    url += `&filters={${Object.entries(filter)
      .map(([key, value]) => `"${key}_eq":${value}`)
      .join(',')}}`
  }
  // id, desc
  if (
    (!filter ||
      !Object.entries(filter)?.filter(([_, value]) => value)?.length) &&
    type
  )
    url += `&filters={"status_in":[${type}]}`
  if (sort?.[0]) {
    url += `&sort_by=${sort.map(d => (d.desc ? `-${d.id}` : d.id)).join(',')}`
  }
  return getAPICall(url, { returnObject: true })
}

export const getAllData = ({
  source,
  page,
  search,
  type,
  fileType,
  filter,
  sort
}) => {
  let url = `items/${source}?page=${fileType ? -1 : page}`
  if (search) url += `&search=${search}`
  if (filter && Object.entries(filter)?.filter(([_, value]) => value)?.length) {
    url += `&filters={${Object.entries(filter)
      .map(([key, value]) => `"${key}_eq":"${value}"`)
      .join(',')}}`
  }
  if (fileType) url += `&download_file_type=${fileType}`
  // id, desc
  if (
    (!filter ||
      !Object.entries(filter)?.filter(([_, value]) => value)?.length) &&
    type
  )
    url += `&filters={"status_in":[${type}]}`
  if (sort?.[0]) {
    url += `&sort_by=${sort.map(d => (d.desc ? `-${d.id}` : d.id)).join(',')}`
  }
  return getAPICall(url, { returnObject: true })
}

export const createTicket = ({ body }) => {
  return postAPICall(`/create-ticket`, { body, returnObject: true });
};

export const getAttachmentListAPI = ({ id }) => {
  return getAPICall(`get-ticket-attachments/${id}`);
};

export const getAttachmentLinksAPI = ({ link }) => {
  return new Promise((resolve, reject) => {
    apiCallProtected
      .get(`view-attachment?url=${link}`, {
        responseType: "blob",
      })
      .then(async (response) => {
        // if (!response.ok) throw new Error("Network response was not ok");
        try {
          resolve(response);
        } catch (e) {
          console.log("catch", e);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      });
  });
};

export const getTicketsData = ({
  source,
  page,
  search,
  type,
  fileType,
  filter,
  sort,
  ticket_subject,
}) => {
  let url = `/${source}?page=${fileType ? -1 : page}&records_per_page=10`;
  
  if (search) url += `&search=${encodeURIComponent(search)}`;

  if (filter && Object.entries(filter).length > 0) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value != null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            url += `&${key}=${encodeURIComponent(v)}`;
          });
        } else {
          url += `&${key}=${encodeURIComponent(value)}`;
        }
      }
    });
  }

  if (fileType) {
    url += `&download_file_type=${fileType}`;
  }

  if (sort?.[0]) {
    url += `&sort_by=${sort
      .map((d) => (d.desc ? `-${d.id}` : d.id))
      .join(",")}`;
  }

  if (ticket_subject) {
    url += `&ticket_subject=${encodeURIComponent(ticket_subject)}`;
  }

  return getAPICall(url, { returnObject: true });
};

export const getAllDataWithFilters = ({
  source,
  page,
  search,
  type,
  fileType,
  filter,
  sort
}) => {
  let url = `items/${source}?page=${fileType ? -1 : page}`
  if (search) url += `&search=${search}`
  if (filter && Object.entries(filter)?.filter(([_, value]) => value)?.length) {
    // url += `&filters={${Object.entries(filter).map(([key, value]) => `"${key}_eq":${value}`).join(",")}}`;
    url += `&filters={${filter
      .map(
        ({ key, value, condition = 'eq' }) => `"${key}_${condition}":"${value}"`
      )
      .join(',')}}`
  }
  if (fileType) url += `&download_file_type=${fileType}`
  // id, desc
  // if ((!filter || !Object.entries(filter)?.filter(([_, value]) => value)?.length) && type) url += `&filters={"status_in":[${type}]}`;
  if (sort?.[0]) {
    url += `&sort_by=${sort.map(d => (d.desc ? `-${d.id}` : d.id)).join(',')}`
  }
  return getAPICall(url, { returnObject: true })
}

export const getAllDataV2 = ({
  source,
  page,
  per_page = 10,
  summary,
  search,
  fileType,
  filter,
  sort,
  download
}) => {
  let url = `query/${source}?page=${fileType ? -1 : page}&per_page=${per_page}`
  if (search) url += `&search=${search}`
  if (summary) url += `&summary=${summary?.join(',')}`
  if (Array.isArray(filter) && filter.length) {
    url += `&filters=${filter
      .map(({ key, value, condition = '=' }) => `${key}${condition}'${value}'`)
      .join(' and ')}`
  }
  if (fileType) url += `&download_file_type=${fileType}`
  if (download) url += `&export_as_file=true`
  // id, desc
  if (Array.isArray(sort) && sort.length) {
    url += `&sort_by=${sort
      .map(d => (d.desc ? `${d.id} desc` : d.id))
      .join(',')}`
  }
  return getAPICall(url, { returnObject: true })
}

export const getReportData = ({
  source,
  page,
  per_page = 10,
  summary,
  search,
  fileType,
  filter,
  sort,
  download
}) => {
  let url = `reports/${source}?page=${
    fileType ? -1 : page
  }&per_page=${per_page}`
  if (search) url += `&search=${search}`
  if (summary) url += `&summary=${summary?.join(',')}`
  if (Array.isArray(filter) && filter.length) {
    url += `&filters={${filter
      .map(
        ({ field, value }) =>
          `"${field}":${
            Array.isArray(value) ? '[' + value + ']' : '"' + value + '"'
          }`
      )
      .join(',')}}`
  }
  if (fileType) url += `&download_file_type=${fileType}`
  if (download) url += `&export_as_file=true`
  // id, desc
  if (Array.isArray(sort) && sort.length) {
    url += `&sort_by=${sort
      .map(d => (d.desc ? `${d.id} desc` : d.id))
      .join(',')}`
  }
  return getAPICall(url, { returnObject: true })
}
export const getDataById = ({ id, source }) => {
  let url = `items/${source}/${id}`
  return getAPICall(url, { returnFirstItem: true })
}

export const getHeaders = ({ source }) => {
  return getAPICall(`fields/${source}`)
}

export const createNewRecord = ({ source, body }) => {
  return postAPICall(`items/${source}`, { body })
}

export const updateRecord = ({ source, body }) => {
  return patchAPICall(`items/${source}/${body.id}`, { body })
}

export const bulkUpsert = ({ source, body }) => {
  return postAPICall(`bulk-upsert`, {
    body: {
      [source]: body
    }
  })
}

export const getAllDataV4 = ({ source, sort, ...props }) => {
  let url = `${source}`
  let filters = []
  if (props && Object.entries(props)?.filter(([_, value]) => value)?.length) {
    Object.entries(props).forEach(([key, value]) => {
      if (value) filters.push(`${key}=${value}`)
    })
  }
  if (filters.length) url += `?${filters.join('&')}`
  if (Array.isArray(sort) && sort.length) {
    url += `&sort_by=${sort
      .map(d => (d.desc ? `${d.id} desc` : d.id))
      .join(',')}`
  }
  return getAPICall(url, { returnObject: true })
}