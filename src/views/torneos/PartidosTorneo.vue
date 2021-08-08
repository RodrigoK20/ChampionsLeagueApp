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
      <v-col sm="12">
        <v-text-field
          v-model="torneo_id"
          hidden
          class="inputRef"
          type="number"
          required
        />

        <v-row no-gutters>
          <v-col md="6">
            <span>Seleccionar Equipo A: </span>
            <select
              id="select1"
              v-model="equipo_a"
              required
            >
              <option
                v-for="equipo in equipos"
                :key="equipo.id_equipo"
                :value="equipo.nombre_equipo"
              >
                {{ equipo.nombre_equipo }}
              </option>
            </select>
          </v-col>
          <v-col md="6">
            <span>Seleccionar Equipo B: </span>
            <select
              id="select2"
              v-model="equipo_b"

              required
            >
              <option
                v-for="equipo in equipos"
                :key="equipo.id_equipo"
                :value="equipo.nombre_equipo"
              >
                {{ equipo.nombre_equipo }}
              </option>
            </select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="12">
        <v-row no-gutters>
          <v-col md="6">
            <span>Estadio </span>
            <select
              id="select3"
              v-model="estadio_id"
              required
            >
              <option
                v-for="estadio in estadios"
                :key="estadio.id_estadio"
                :value="estadio.id_estadio"
              >
                {{ estadio.nombre_estadio }}
              </option>
            </select>
          </v-col>
          <v-col md="6">
            <span>Fecha partido: </span>
            <v-text-field
              v-model="fecha_partido"
              clearable
              class="inputRef"
              type="date"
              required
              :rules="[() => fecha_partido.length > 0 || 'Campo requerido']"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="12">
        <v-row no-gutters>
          <v-col md="6">
            <span>Hora partido: </span>
            <v-text-field
              v-model="hora"
              clearable
              class="inputRef"
              placeholder="Hora partido"
              type="text"
              required
              :rules="[() => hora.length > 0 || 'Campo requerido']"
            />
          </v-col>
          <v-col md="6">
            <span>Número partido: </span>
            <v-text-field
              v-model="numero_partido"
              clearable
              class="inputRef"
              placeholder="Número partido"
              type="number"
              required
              :rules="[() => numero_partido.length > 0 || 'Campo requerido']"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-btn
      color="blue darken-1"
      @click="addItem()"
    >
      Agregar Partido
    </v-btn>

    <v-row>
      <v-col sm="12">
        <v-simple-table
          id="detalles"
          class="table table-striped"
        >
          <thead>
            <tr>
              <th>EQUIPO A</th>
              <th>EQUIPO B</th>
              <th>ESTADIO</th>
              <th>FECHA PARTIDO</th>
              <th>HORA PARTIDO</th>
              <th>NUMERO  PARTIDO</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in rowData"
              :key="item.torneo_id"
            >
              <td>{{ item.equipo_a }}</td>
              <td>{{ item.equipo_b }}</td>
              <td>{{ item.nombre_estadio }}</td>
              <td>{{ item.fecha_partido }}</td>
              <td>{{ item.hora }}</td>
              <td>{{ item.numero_partido }}</td>
            </tr>
          </tbody>
        </v-simple-table>

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
        // array select estadios
        estadios: [],
        equipos: [],

        torneo_id: '',
        estadio_id: '',
        nombre_estadio: '',
        equipo_a: '',
        equipo_b: '',
        fecha_partido: '',
        hora: '',
        numero_partido: '',
        rowData: [],

      }
    },
    mounted () {
      this.torneo_id = this.$route.params.id

      this.obtenerEstadios()
      this.obtenerEquipos()
    },
    methods: {

      getFile (event) {
        this.file = event.target.files[0]
        console.log(this.file)
      },

      // Select estadios
      obtenerEstadios () {
        this.axios.get(url + 'Estadio/Get')
          .then(response => {
            console.log(response)
            this.estadios = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      },

      obtenerEquipos () {
        this.axios.get(url + 'Equipo/GetEquiposTorneo/' + this.torneo_id)
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
          url: 'http://localhost:30305/api/PartidosTorneo/Add',
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
                text: 'Partidos guardados exitosamente!',
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
        var select3 = document.getElementById('select3')
        var nombre_estadio = select3.selectedOptions[0].label;

        if (this.numero_partido > 0 && this.torneo_id > 0 && this.equipo_a.length > 0 && this.equipo_b.length > 0 && this.fecha_partido.length > 0 && this.hora.length > 0 && this.estadio_id > 0 && nombre_estadio.length > 0) {
          var equipos_partido = {
            torneo_id: this.torneo_id,
            estadio_id: this.estadio_id,
            equipo_a: this.equipo_a,
            equipo_b: this.equipo_b,
            fecha_partido: this.fecha_partido,
            hora: this.hora,
            numero_partido: this.numero_partido,
            nombre_estadio: nombre_estadio,
          }
          this.rowData.push(equipos_partido)
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese todos los campos requeridos correctamente',
            showConfirmButton: false,
            timer: 2800,
          })
        }
        // console.log(equipos_torneo.id_equipo)
      },

    },
  }

</script>

<style>
#select1, #select2,#select3{
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
