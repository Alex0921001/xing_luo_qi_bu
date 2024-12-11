import { defineStore } from 'pinia'
import type { Dayjs } from 'dayjs'

interface FormState {
  Id?: number
  name: string
  birthday: string
  birthtime?: Dayjs
  address: string
  sex: string
  tag: string
  comment: string
  lng?: number
  lat?: number
}
export const useFormStore = defineStore('form', {
  state: (): FormState => ({
    Id: undefined,
    name: '',
    birthday: '',
    birthtime: undefined,
    address: '',
    sex: '男',
    tag: '',
    comment: '',
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
