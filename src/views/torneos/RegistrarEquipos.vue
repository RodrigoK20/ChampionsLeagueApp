<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <v-btn
          fab
          dark
          color="red"
          to="/torneos"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-arrow-left-thick</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="id_torneo"
          class="inputRef"
          type="text"
          hidden
          required
        />
      </v-col>
    </v-row>
    <v-col cols="6">
      <span>Seleccionar Equipo: </span>
      <select
        id="select1"
        ref="seleccionado"
        v-model="id_equipo"

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
      <v-btn
        color="blue darken-1"
        @click="addItem()"
      >
        Agregar Equipo
      </v-btn>
    </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-simple-table
          id="detalles"
          class="table table-striped"
        >
          <thead>
            <tr>
              <th>ID_TORNEO</th>
              <th>ID_EQUIPO</th>
              <th>EQUIPO</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in rowData"
              :key="item.id_torneo"
            >
              <td>{{ item.id_torneo }}</td>
              <td>{{ item.id_equipo }}</td>
              <td>{{ item.nombre_equipo }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-col cols="6">
      <v-btn
        color="green darken-1"
        @click="registrar()"
      >
        Registrar
      </v-btn>
    </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'

  import Vue from 'vue'
  import VueSwal from 'vue-swal'
  const url = 'http://localhost:30305/api/'

  Vue.use(VueSwal)

  export default {

    name: '',
    data () {
      return {
        // array select equipos
        equipos: [],
        id_torneo: '',
        id_equipo: '',
        nombre_equipo: '',
        rowData: [],

      }
    },
    mounted () {
      this.id_torneo = this.$route.params.id

      this.obtenerEquipos()
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

      registrar () {
        const router = this.$router
        const params = this.rowData
        const myJson = JSON.stringify(params)

        // para saber que capturamos desde el navegador
        axios({
          url: 'http://localhost:30305/api/Torneo/AddEquipos',
          method: 'post',
          headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
          },
          data: myJson,
        })
          .then((response) => {
            console.log(response)

            if (response.data === 'Agregado') {
              this.dialog = true
              router.push('/torneos')
              this.rowData = ''
              this.myJson = ''

              this.$swal({
                icon: 'success',
                title: 'Agregado',
                text: 'Los equipos han sido agregados al torneo!',
                showConfirmButton: true,
              })
            } else if (response.data === 'El equipo ya se encuentra registrado en el torneo') {
              this.dialog = true
              this.$swal({
                icon: 'warning',
                title: 'Advertencia',
                text: 'El equipo ya se encuentra registrado en el torneo!',
                showConfirmButton: true,
              })
            } else {
              this.$swal({
                icon: 'error',
                title: 'Error',
                text: 'Error en el servidor',
                showConfirmButton: false,
                timer: 2800,
              })
            }
          })
      },

      // Agregar item a la tabla
      addItem () {
        // Obtener Id del SELECT EQUIPOS
        // this.seleccionado = this.$refs.seleccionado.value;
        // Obtener label select
        var select1 = document.getElementById('select1')
        var nombre_team = select1.selectedOptions[0].label

        // alert(nombre_team);

        var equipos_torneo = {
          id_torneo: this.id_torneo,
          id_equipo: this.id_equipo,
          nombre_equipo: nombre_team,
        }
        this.rowData.push(equipos_torneo)
        console.log(equipos_torneo.id_equipo)
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
</style>
