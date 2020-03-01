<template>
  <v-container>
    <div>
      <h1>
        Welcome, {{ this.$root.user.firstname }}
        {{ this.$root.user.lastname }}
      </h1>
    </div>

      <v-row justify="space-between">
      <v-col sm="6" cols="12">
        <v-row>
        <v-col
          cols="12"
          md="5"
        >
        <v-text-field v-model="title" label="Titre exercice"></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
        <v-select
          v-model="lang"
          :items="items"
          :rules="[v => !!v || 'Item is required']"
          label="Langage"
          required
        ></v-select>
        </v-col>

        <v-col
          cols="12"
          md="2"
        >
         <v-btn small color="primary" @click="saveExercise"> Save </v-btn>
        </v-col>
        </v-row>
        <v-textarea
          v-model="instructions"
          label="Consignes"
          required
        ></v-textarea>
        <h2>Template de résolution : </h2>
        <div id="editorResolv" class="exercise-editor-ace-editor"></div>
        <br/>
        <h2>Sortie console : </h2>
             <v-alert type="info" v-if="stdout">
                <p>{{ stdout }}</p>
              </v-alert>
      </v-col>

      <v-col sm="6" cols="12">
        <h2>Tests :</h2>
        <div id="tests" class="exercise-editor-ace-editor"></div>
        <br/>
        <v-row>
        <h2> Sandbox : </h2>
         <v-btn small color="primary" @click="compile"> Compile </v-btn>
        </v-row>
        <div id="solution" class="exercise-editor-ace-editor"></div>
        <br/>
        <h2> Résultat des tests : </h2>

           <v-list-item two-line v-for="(item) in todos" :key="item.id">
             <v-alert type="warning">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-title>{{ item.line }}</v-list-item-title>
                <v-list-item-title>{{ item.time }}</v-list-item-title>
                <v-list-item-title v-if="item.message">{{ item.message }}</v-list-item-title>
              </v-list-item-content>
              </v-alert>
            </v-list-item>

      </v-col>
      </v-row>
  </v-container>
</template>

<script>
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'

export default {
  name: 'Main',
  data: () => ({
    state: false,
    valid: false,
    editorResolv: null,
    editorTests: null,
    editorSandbox: null,
    items: ['Python'],
    title: '',
    instructions: '',
    lang: 'Python',
    difficulty: 5,
    todos: [],
    stdout: ''
  }),
  mounted () {
    this.editor = ace.edit('editorResolv')
    this.editor.setTheme('ace/theme/monokai')
    this.editor.session.setMode(`ace/mode/${this.lang}`)

    this.editorT = ace.edit('tests')
    this.editorT.setTheme('ace/theme/monokai')
    this.editorT.session.setMode(`ace/mode/${this.lang}`)

    this.editorS = ace.edit('solution')
    this.editorS.setTheme('ace/theme/monokai')
    this.editorS.session.setMode(`ace/mode/${this.lang}`)
  },
  methods: {
    async saveExercise () {
      try {
        const response = await this.axios.post('http://localhost:3000/api/v1/exercise', {
          creation_date: new Date(),
          title: this.title,
          instructions: this.instructions,
          tests: this.editorT.getValue(),
          solution: this.editorS.getValue(),
          lang: this.lang,
          difficulty: this.difficulty,
          score: 5,
          template_regions_rw: [0],
          template_regions: ['panda']
        })
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    },
    async compile () {
      try {
        const resultR = await this.axios.post('http://localhost:3000/api/v1/exercise/sandbox', {
          lang: 'python',
          tests: this.editorT.getValue(),
          solution: this.editorS.getValue()
        })
        this.stdout = resultR.data.stdout
        this.todos = resultR.data.result.tests.map(item => {
          if (item.failure) {
            return {
              name: 'name : ' + item.name,
              line: 'line : ' + item.line,
              time: 'time : ' + item.time,
              message: 'message : ' + item.failure.message
            }
          }
          return {
            name: 'name : ' + item.name,
            line: 'line : ' + item.line,
            time: 'time : ' + item.time
          }
        }).sort((a, b) => a.line < b.line)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    }
  }
}
</script>

<style>
.exercise-editor-ace-editor {
 position: relative;
 height: 20rem;
}
</style>
