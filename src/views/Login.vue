<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
    <v-card
      class="mx-auto"
      max-width="400"
      tile
    >
      <v-form v-model="valid" @submit.prevent="login">
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="username"
                :rules="mailRules"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                required
              ></v-text-field>

            </v-col>
            <v-col class="text-center" cols="12" sm="4">
              <div class="my-2">
                <v-btn color="primary"
                  @click="login"
                >Send</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'Login',
  data: () => ({
    state: false,
    valid: false,
    username: '',
    password: '',
    todos: [],
    mailRules: [
      v => !!v || 'Email is required',
      v => v.match(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/) || 'Wrong email'
    ],
    passwordRules: [
      v => !!v || 'Password is required'
    ]
  }),
  methods: {
    async login () {
      const { username, password } = this
      try {
        const result = await this.axios.post('http://localhost:3000/api/v1/login', {
          username,
          password
        })
        this.$root.user = result.data
        this.loggedIn = true
        this.$router.push('/')
      } catch (err) {
        this.errorLogin = err
      }
    }

  }
}
</script>
