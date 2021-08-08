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
          <span class="text-h5">Registrar Jugador</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nombre_jugador"
                  autofocus
                  clearable
                  class="inputRef"
                  label="Nombre Jugador*"
                  type="text"
                  required
                  :rules="[() => nombre_jugador.length > 0 || 'Campo requerido']"
                />
              </v-col>

              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Fecha Nacimiento*"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="posicion"

                  clearable
                  class="inputRef"
                  label="Posición*"
                  type="text"
                  required
                  :rules="[() => posicion.length > 0 || 'Campo requerido']"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="dorsal"

                  clearable
                  class="inputRef"
                  label="Dorsal*"
                  type="number"
                  required
                  :rules="[() => dorsal.length > 0 || 'Campo requerido']"
                />
              </v-col>

              <v-col cols="12">
                <span>Seleccionar Equipo: </span>
                <select
                  id="select1"
                  v-model="equipo_id"
                  required
                >
                  <option
                    v-for="equipo in equipos"
                    :key="equipo.id_equipo"
                    :value="equipo.id_equipo"
                  >
                    {{ equipo.nombre_equipo }}
                  </option>
                </select>
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
            @click="guardarJugador()"
          >
            Guardar
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <base-material-card
      id="lista"
      icon="mdi-account-group"
      title="Lista de Jugadores"
      class="px-5 py-3"
    >
      <v-card-title>
        Jugadores
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>

      <v-data-table

        :headers="headers"
        :items="jugadores"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="orange"
            fab
            small
            :to="{name:'DetalleJugador',params:{id:item.id_jugador}}"
          >
            <v-icon>mdi-alert-circle</v-icon>
          </v-btn>
        </template>
      </v-data-table>
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
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        // array select equipos
        equipos: [],
        menu: false,
        dialog: false,
        nombre_jugador: '',
        fecha_nac: '',
        fotografia: '',
        posicion: '',
        dorsal: '',
        equipo_id: '',

        jugadores: [],

        search: '',

        headers: [
          { text: 'Nombre', value: 'nombre' },
          { text: 'Posicion', value: 'posicion' },
          { text: 'Dorsal', value: 'dorsal' },
          { text: 'Equipo', value: 'nombre_equipo' },
          { text: 'Puntos', value: 'puntos' },
          { text: 'Acciones', value: 'actions', sortable: false },

        ],
        /* jugador: {

          nombre_jugador: '',
          fecha_nac: '',
          fotografia: '',
          posicion: '',
          dorsal: '',
          equipo_id: '',
        },
 */
      }
    },
    mounted () {
      this.obtenerEquipos()
      this.obtenerJugadores()
    },
    methods: {

      getFile (event) {
        this.file = event.target.files[0]
        console.log(this.file)
      },

      // Select equipos
      obtenerEquipos () {
        this.axios.get(url + 'Equipo/Get')
          .then(response => {
            console.log(response)
            this.equipos = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      },

      guardarJugador () {
        // const router = this.$router

        // para saber que capturamos desde el navegador
        axios.post(url + 'Jugador/Add', {
          nombre: this.nombre_jugador,
          fecha_nac: this.date,
          fotografia: this.fotografia,
          posicion: this.posicion,
          dorsal: this.dorsal,
          equipo_id: this.equipo_id,
        })
          .then((response) => {
            console.log(response)
            if (response.data === 'Ingrese correctamente los campos') {
              this.dialog = true
              this.$swal({
                icon: 'error',
                title: 'Error',
                text: 'Ingrese correctamente los campos',
                showConfirmButton: true,
              })
            } else if (response.data === 'El nombre del jugador ya se encuentra registrado') {
              this.dialog = true
              this.$swal({
                icon: 'warning',
                title: 'Advertencia',
                text: 'El nombre del equipo ya se encuentra registrado!',
                showConfirmButton: true,
              })
            } else {
              this.obtenerJugadores()
              this.$swal({
                icon: 'success',
                title: 'Jugador registrado correctamente',
                text: 'Guardado en la base de datos',
                showConfirmButton: false,
                timer: 2800,
              })
            }

            // router.push('/equipos')
            this.dialog = false
            this.nombre_jugador = ''
            this.date = ''
            this.fotografia = ''
            this.posicion = ''
            this.dorsal = ''
            this.equipo_id = ''
          })
      },

      obtenerJugadores () {
        this.axios.get(url + 'Jugador/Get')
          .then(response => {
            console.log(response)
            this.jugadores = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      },

      imageUpload (event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        axios.post(
          url + 'Jugador/SaveFile',
          formData)
          .then((response) => {
            console.log(response)
            this.fotografia = response.data
          })
      },

    },
  }

</script>

<style>
#select1{
display: block;
  font-size: 16px;
  font-family: 'Verdana', sans-serif;
  font-weight: 400;
  color: #444;
  line-height: 1.3;
  padding: .4em 1.4em .3em .8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
 margin: 20px auto;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0,0,0,.03);
  border-radius: .3em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#f7f7f7 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
}

tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
 }
</style>
