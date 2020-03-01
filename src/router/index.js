import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Main from '@/components/Main'
import axios from 'axios'

Vue.use(VueRouter)

function createRouter (state) {
  async function beforeEnter (to, from, next) {
    try {
      const { data: user } = await axios.get('http://localhost:3000/api/v1/me')
      state.user = user
      console.log(state.user)
      next()
    } catch (err) {
      console.log('err', err)
      next('/login')
    }
  }

  const routes = [
    {
      path: '/',
      name: 'Main',
      component: Main,
      beforeEnter
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]

  return new VueRouter({
    routes
  })
}

export default createRouter
