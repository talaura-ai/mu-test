import { Endpoints } from "../../../enpoints/v1"
import AxiosService from "../../../client-interceptor"

const Subscribers = async (query: string) => {
  return await AxiosService.get(Endpoints.Subscribers + query)
}

const Blogs = async (query: string) => {
  return await AxiosService.get(Endpoints.Blogs + query)
}

const AddBlog = async (body: any) => {
  return await AxiosService.post(Endpoints.AddBlog, body)
}

const UpdateBlog = async (body: any) => {
  return await AxiosService.post(Endpoints.UpdateBlog, body)
}

const GetBlogDetail = async (query: string) => {
  return await AxiosService.get(Endpoints.GetBlogDetail + query)
}

const DeleteBlog = async (body: any) => {
  return await AxiosService.post(Endpoints.DeleteBlog, body)
}

const Videos = async (query: string) => {
  return await AxiosService.get(Endpoints.Videos + query)
}

const AddVideo = async (body: any) => {
  return await AxiosService.post(Endpoints.AddVideo, body)
}

const UpdateVideo = async (body: any) => {
  return await AxiosService.post(Endpoints.UpdateVideo, body)
}

const GetVideoDetail = async (query: string) => {
  return await AxiosService.get(Endpoints.GetVideoDetail + query)
}

const DeleteVideo = async (body: any) => {
  return await AxiosService.post(Endpoints.DeleteVideo, body)
}

const GetDashboardData = async () => {
  return await AxiosService.get(Endpoints.DashboardCount)
}

const GetCategoryData = async () => {
  return await AxiosService.get(Endpoints.categories)
}

const GetMediaData = async () => {
  return await AxiosService.get(Endpoints.medias)
}

const AddMedia = async (body: any) => {
  return await AxiosService.post(Endpoints.AddMedia, body)
}
const DeleteMedia = async (body: any) => {
  return await AxiosService.post(Endpoints.DeleteMedia, body)
}

export default { Subscribers, Blogs, AddBlog, UpdateBlog, DeleteBlog, Videos, AddVideo, UpdateVideo, DeleteVideo, GetBlogDetail, GetVideoDetail, GetDashboardData, GetCategoryData, GetMediaData, AddMedia,DeleteMedia }
