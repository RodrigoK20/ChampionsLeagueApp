<template>
  <v-container
    id="ListarEquipos"
    fluid
    tag="section"
  >
    <v-dialog
      ref="modalEq"
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          color="blue"

          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Registrar Equipo Futbol</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nombre_equipo"
                  autofocus
                  clearable
                  class="inputRef"
                  label="Nombre Equipo*"
                  type="text"
                  required
                  :rules="[() => nombre_equipo.length > 0 || 'Campo requerido']"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <input
                  label="Logo*"
                  type="file"
                  @change="imageUpload"
                >
              </v-col>
            </v-row>
          </v-container>
          <small>*Campos obligatorios</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
          <button
            color="blue darken-1"
            text
            @click="guardarEquipo()"
          >
            Guardar
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <base-material-card
      id="lista"
      icon="mdi-account-group"
      title="Equipos"
      class="px-5 py-3"
    >
      <v-simple-table
        id="tabla"
        fixed-header
        class="elevation-3"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Equipo</th>
            <th>Logo</th>
            <th>Puntaje</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="eq in equipos"
            :key="eq.id"
          >
            <td>{{ eq.id_equipo }}</td>
            <td>{{ eq.nombre_equipo }}</td>
            <td>
              <img
                :src="'http://localhost:30305/photos/' + eq.logo"
                style="width: 150px; height: 100px"
              >
            </td>
            <td>{{ eq.puntaje }}</td>
            <td>
              <v-btn
                :to="{name:'JugadoresEquipo',params:{id:eq.id_equipo}}"
                fab
                color="light-blue"
              >
                <v-icon>mdi-account-multiple-check</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'

  import Vue from 'vue'
  import VueSwal from 'vue-swal'
  const url = 'http://localhost:30305/api/'

  Vue.use(VueSwal)

  export default {
    name: 'ListarEquipos',
    data () {
      return {
        dialog: false,
        equipos: null,
        logo: '',
        id: '',
        nombre_equipo: '',
      }
    },
    mounted () {
      this.obtenerEquipos()
    },
    methods: {

      getFile (event) {
        this.file = event.target.files[0]
        console.log(this.file)
      },

      guardarEquipo () {
        // const router = this.$router

        // para saber que capturamos desde el navegador
        axios.post(url + 'Equipo/Add', {
          nombre_equipo: this.nombre_equipo,
          logo: this.logo,
        })
          .then((response) => {
            // this.refreshData()
            // alert(response.data)
            // eslint-disable-next-line eqeqeq
            if (response.data === 'Ingrese correctamente los campos') {
              this.dialog = true
              this.$swal({
                icon: 'error',
                title: 'Error',
                text: 'Ingrese correctamente los campos',
                showConfirmButton: true,
              })
            } else if (response.data === 'El nombre del equipo ya se encuentra registrado') {
              this.dialog = true
              this.$swal({
                icon: 'warning',
                title: 'Advertencia',
                text: 'El nombre del equipo ya se encuentra registrado!',
                showConfirmButton: true,
              })
            } else {
              this.obtenerEquipos()
              this.$swal({
                icon: 'success',
                title: 'Equipo registrado correctamente',
                text: 'Guardado en la base de datos',
                showConfirmButton: false,
                timer: 2800,
              })
            }

            // router.push('/equipos')
            this.dialog = false
            this.nombre_equipo = ''
            this.logo = null
          })
      },

      obtenerEquipos () {
        axios.get(url + 'Equipo/Get')
          .then(response => {
            console.log(response)
            this.equipos = response.data
          })
          .catch()
      },

      imageUpload (event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          url + 'Equipo/SaveFile',
          formData)
          .then((response) => {
            console.log(response)
            this.logo = response.data
            console.log(this.logo)
          })
      },

    },
  }
</script>
