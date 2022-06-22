<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk, mdiAlertCircle, mdiOpenInNew } from '@mdi/js'

import { useMainStore } from '@/stores/main'
import { useFetch } from '@/composition/useFetch'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import Notification from '@/components/Notification.vue'

const router = useRouter()
const mainStore = useMainStore()

const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref(null)

const isDisabled = computed(() => {
  return Object.values(form).some((value) => value === '')
})

const submit = async () => {
  const { data, error } = await useFetch('post', '/admin/login', {
    email: form.email,
    password: form.password
  })

  if (error) {
    errorMessage.value = error
  } else {
    errorMessage.value = null
    const { data: { user, token } } = data

    mainStore.setUser({ ...user })
    mainStore.setUserToken(token)

    router.replace('/dashboard')
  }
}
</script>

<template>
  <full-screen-section
    v-slot="{ cardClass, cardRounded }"
    bg="login"
  >
    <card-component
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <notification
        v-if="errorMessage"
        color="danger"
        :icon="mdiAlertCircle"
      >
        {{ errorMessage }}
        <template #right="{ dismiss }">
          <jb-button
            :icon="mdiOpenInNew"
            label="tutup"
            color="danger"
            small
            @click="dismiss"
          />
        </template>
      </notification>

      <field
        label="Email"
        help="Mohon tuliskan alamat email admin anda"
      >
        <control
          v-model="form.email"
          autocomplete="username"
          :icon="mdiAccount"
          name="login"
          placeholder="Contoh: John Doe"
          type="email"
        />
      </field>

      <field
        label="Password"
        help="Mohon tuliskan password admin anda"
      >
        <control
          v-model="form.password"
          autocomplete="current-password"
          :icon="mdiAsterisk"
          name="password"
          placeholder="Contoh: johndoe11"
          type="password"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button
          color="info"
          :disabled="isDisabled"
          label="Login"
          type="submit"
        />
      </jb-buttons>
    </card-component>
  </full-screen-section>
</template>
