import { defineStore } from 'pinia'
import type { Dayjs } from 'dayjs'

interface FormState {
  name: string
  birthday: string
  birthtime?: Dayjs
  address: string
  sex: string
  tag: string
  commnet: string
  lng?: number
  lat?: number
}
export const useFormStore = defineStore('form', {
  state: (): FormState => ({
    name: '',
    birthday: '',
    birthtime: undefined,
    address: '',
    sex: '男',
    tag: '',
    commnet: '',
    lng: undefined,
    lat: undefined
  }),
  persist: true,
  actions: {
    setFormState(formData: FormState) {
      this.$patch(formData)
    }
  }
})
