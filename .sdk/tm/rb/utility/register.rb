# Joplin SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

JoplinUtility.registrar = ->(u) {
  u.clean = JoplinUtilities::Clean
  u.done = JoplinUtilities::Done
  u.make_error = JoplinUtilities::MakeError
  u.feature_add = JoplinUtilities::FeatureAdd
  u.feature_hook = JoplinUtilities::FeatureHook
  u.feature_init = JoplinUtilities::FeatureInit
  u.fetcher = JoplinUtilities::Fetcher
  u.make_fetch_def = JoplinUtilities::MakeFetchDef
  u.make_context = JoplinUtilities::MakeContext
  u.make_options = JoplinUtilities::MakeOptions
  u.make_request = JoplinUtilities::MakeRequest
  u.make_response = JoplinUtilities::MakeResponse
  u.make_result = JoplinUtilities::MakeResult
  u.make_point = JoplinUtilities::MakePoint
  u.make_spec = JoplinUtilities::MakeSpec
  u.make_url = JoplinUtilities::MakeUrl
  u.param = JoplinUtilities::Param
  u.prepare_auth = JoplinUtilities::PrepareAuth
  u.prepare_body = JoplinUtilities::PrepareBody
  u.prepare_headers = JoplinUtilities::PrepareHeaders
  u.prepare_method = JoplinUtilities::PrepareMethod
  u.prepare_params = JoplinUtilities::PrepareParams
  u.prepare_path = JoplinUtilities::PreparePath
  u.prepare_query = JoplinUtilities::PrepareQuery
  u.graphql_body = JoplinUtilities::GraphqlBody
  u.graphql_errors = JoplinUtilities::GraphqlErrors
  u.result_basic = JoplinUtilities::ResultBasic
  u.result_body = JoplinUtilities::ResultBody
  u.result_headers = JoplinUtilities::ResultHeaders
  u.transform_request = JoplinUtilities::TransformRequest
  u.transform_response = JoplinUtilities::TransformResponse
}
