import { defineStore } from 'pinia'

interface FormState {
  name: string
  birthday: string
  birthtime: string
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
    birthtime: '',
    address: '',
    sex: '男',
    tag: '',
    commnet: '',
    lng: undefined,
    lat: undefined
  }),
  actions: {
    setFormState(formData: FormState) {
      this.$patch(formData)
    }
  }
})
