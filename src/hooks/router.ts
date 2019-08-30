import { useContext, useMemo, useCallback } from 'react'
import {
  __RouterContext as RouterContext,
  RouteComponentProps
} from 'react-router'
import { Location } from 'history'
import * as queryString from 'query-string'
import uriTemplate, { URITemplate } from 'uri-templates'

type ParsedQuery = queryString.ParsedQuery

export const useRouter = <T>(): RouteComponentProps<T> =>
  useContext(RouterContext) as RouteComponentProps<T>

export const useLocation = (): Location => {
  const { location } = useRouter()
  return location
}

export const useParams = <T>(): T => {
  const { match } = useRouter<T>()
  return match.params
}

export const useQuery = <T extends ParsedQuery>(): T => {
  const { search } = useLocation()
  const query = useMemo(() => queryString.parse(search), [search])
  return query as T
}

interface UpdateQueryOptions {
  replace: boolean
}

type UpdateQuery<T> = (patch: Partial<T>) => void

type Visit<T> = (params: T) => void

const USE_PUSH = { replace: false }

export const useUpdateQuery = <T extends ParsedQuery>(
  options: UpdateQueryOptions = USE_PUSH
): UpdateQuery<T> => {
  const { history } = useRouter()
  const query = useQuery<T>()
  const { replace } = options
  const updateQuery = useCallback(
    (patch: Partial<T>): void => {
      const newQuery = { ...query, ...patch }
      const newSearch = queryString.stringify(newQuery)
      if (replace) {
        history.replace({ search: newSearch })
      } else {
        history.push({ search: newSearch })
      }
    },
    [history, query, replace]
  )
  return updateQuery
}

export const useNavigate = <T>(
  to: string | URITemplate,
  options: UpdateQueryOptions = USE_PUSH
): Visit<T> => {
  const { history } = useRouter()
  const { replace } = options
  const template = useMemo(() => {
    if (typeof to === 'string') {
      return uriTemplate(to)
    }
    return to
  }, [to])
  const visit = useCallback(
    (params: T): void => {
      const newLocation = template.fill(params as any)
      if (replace) {
        history.replace(newLocation)
      } else {
        history.push(newLocation)
      }
    },
    [template, history, replace]
  )
  return visit
}
