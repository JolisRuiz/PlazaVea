import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField } from '@material-ui/core';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Pagination } from '@mui/material';
import Select from '@mui/material/Select';
import { Edit, Delete, Clear } from '@material-ui/icons';
import Stack from '@mui/material/Stack';
//import "bootstrap/dist/css/bootstrap.min.css"; 

let request = false;
let traveledRows;
let initialRow;
let finalRow;
let necessaryPages;

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],  
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  },
  btnNewUser:{
    position: 'absolute',
    left: -60
  }

}))
function App({controller,map,keyTable,rowStatus,columnName1,columnName2,columnName3}) {
  const baseUrl = 'https://localhost:7230/' + controller+'/';
  //const baseUrl = 'https://apinvisualwsv2.azurewebsites.net'+ '/' + controller+'/';
  const [pageSize, setPageSize] = useState(5); //Tamaño de la pagina
  const [actualPage, setActualPage] = useState(1);  
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [dataAux, setDataAux] = useState([]);
  const [dataPaginacion, setDataPaginacion] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalDeshabilitar, setModalDeshabilitar] = useState(false);
  const [busqueda, SetBusqueda] = useState("");
  const [totalRows, setTotalRows] = useState();
  const [selectedItem, setSelectedItem]= useState(map);
  const [precioIni, SetprecioIni] = useState("");
  const [precioFin, SetprecioFin] = useState("");

//HandleChanges (Manejo de cambios)
  const handleChangeSelectSimple = (event) => {
    setPageSize(event.target.value);
  };

  const handleChangePagination = (event, value) => {
    setActualPage(value);
    peticionGetPagination();
  };
  const handleChangeRequests = e => {
    const { name, value } = e.target;
    setSelectedItem(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleChangeSearchBar = e => {
    SetBusqueda(e.target.value);
    filtrar(e.target.value);
  }
  const handleChangePrecioMin = e => {
    SetprecioIni(e.target.value);
  }
  const handleChangePrecioFin = e => {
    SetprecioFin(e.target.value);
  }

  const filtrarRangoPrecio = () => {
    filtrarRangos(precioIni, precioFin);
  }
  


//Peticion http API REST  
  const peticionGet = async () => {
    await axios.get(baseUrl).then(response => {
        setDataAux(response.data);
        setData(response.data);
        setTotalRows(response.data.length);
      })
  }

  const peticionGetPagination = async () => {
    await axios.get(baseUrl + actualPage+"/"+ pageSize).then(response => {
        setDataPaginacion(response.data);
        setTotalRows(data.length);
        traveledRows = pageSize*(actualPage-1);
        initialRow = traveledRows + 1;
        finalRow = initialRow + pageSize - 1;
        if(finalRow > data.length){
          finalRow = data.length;
        }
      })
  }

  const peticionPost = async () => {
    delete selectedItem.user_id;
    await axios.post(baseUrl, selectedItem)
      .then(response => {
        abrirCerrarModalInsertar();
        request = true;
      })
  }

  const peticionPut = async () => {
    await axios.put(baseUrl, selectedItem)
      .then(response => {
        var dataNueva=data;
        dataNueva.map(model => {
          if (selectedItem[keyTable] === model[keyTable]) {
            model[columnName1] = selectedItem[columnName1];
            model[columnName2] = selectedItem[columnName2];
          }
        })
        delete selectedItem[columnName1];
        delete selectedItem[columnName2];
        abrirCerrarModalEditar();
        request = true;
      })
  }

  const peticionDelete = async () => {
    request = false
    await axios.delete(baseUrl + selectedItem[keyTable])
      .then(response => {
        abrirCerrarModalEliminar();
      })
    request = true;
  }

  const peticionPutDeshabilitar = async () => {
    request = false;
    await axios.put(baseUrl + selectedItem[keyTable], selectedItem)
      .then(response => {
        var dataNueva = data;
        dataNueva.map(model => {
          if (selectedItem[keyTable] === model[keyTable]) {
            model[rowStatus] = false;
          }
        })
        delete selectedItem[columnName1];
        delete selectedItem[columnName2];
        abrirCerrarModalDeshabilitar();
      })
    request = true;
  }


//Otras funciones
  const filtrar = (terminoBusqueda) => {
    request = false;
    var resultadosBusqueda = dataAux.filter((elemento) => {
      if (elemento[columnName1].toString().toLowerCase().includes(terminoBusqueda.toLowerCase())) {
        return elemento;
      }
    });
    setDataPaginacion(resultadosBusqueda);
    if(terminoBusqueda === "")
    {
    request = true;
    }
  }

  const filtrarRangos = (pini, pfin) => {
    request = false;
    var resultadosBusqueda = dataAux.filter((elemento) => {
      if (elemento[columnName2] >= pini && elemento[columnName2] <= pfin) {
        return elemento;
      }
    });
    setDataPaginacion(resultadosBusqueda);
    if(pini === "" && pfin === "")
    {
    request = true;
    }
  }

  const caclulateNecesaryPages = () =>{
    let verificationCaculate;
    necessaryPages = Math.round(totalRows/pageSize);
    verificationCaculate = necessaryPages * pageSize;
    if(verificationCaculate < totalRows){
      necessaryPages++;
    }

  }
// Funciones ABRIR/CERRAR Modales
  const abrirCerrarModalInsertar = () => {
    if (request === true) {
      request = false;
    }
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    if (request === true) {
      request = false;
    }
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    if (request === true) {
      request = false;
    }
    setModalEliminar(!modalEliminar);
  }

  const abrirCerrarModalDeshabilitar = () => {
    if (request === true) {
      request = false;
    }
    setModalDeshabilitar(!modalDeshabilitar);
  }

  const selectMap = (mapLocal, caso) => {
    setSelectedItem(mapLocal);
    (caso === 'Editar') ? abrirCerrarModalEditar() : (caso === 'Eliminar') ? abrirCerrarModalEliminar() : abrirCerrarModalDeshabilitar()
  }


 

  //Bodys de los Modales
  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar nueva entrada</h3>
      <br />
      <TextField name={columnName1} className={styles.inputMaterial} label={columnName1}  onChange={handleChangeRequests} />
      <br />
      <TextField name={columnName2} className={styles.inputMaterial} label={columnName2} onChange={handleChangeRequests} />
      <br />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
        <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar = (
    <div className={styles.modal}>
      <h3>Editar entrada</h3>
      <br />
      <TextField name={columnName1} className={styles.inputMaterial} label={columnName1} onChange={handleChangeRequests} value={selectedItem && selectedItem[columnName1]}/>
      <br />
      <TextField name={columnName2} className={styles.inputMaterial} label={columnName2} onChange={handleChangeRequests} value={selectedItem && selectedItem[columnName2]}/>
      <br />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPut()}>Editar</Button>
        <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>¿Estas seguro de que quiere eliminar la fila seleccionada, <b>{selectedItem && selectedItem.usuario}?</b></p>
      <div align="right">
        <Button color="secondary" onClick={() => peticionDelete()}>Si</Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )

  const bodyDeshabilitar = (
    <div className={styles.modal}>
      <p>¿Estas seguro de que se quiere deshabilitar la fila seleccionada, <b>{selectedItem && selectedItem.usuario}?</b></p>
      <div align="right">
        <Button color="secondary" onClick={() => peticionPutDeshabilitar()}>Si</Button>
        <Button onClick={() => abrirCerrarModalDeshabilitar()}>No</Button>
      </div>
    </div>
  )

//Actualizacion del get
  useEffect(() => {
    
    peticionGet();
    caclulateNecesaryPages();
    peticionGetPagination();
    
  }, [actualPage,request,pageSize,necessaryPages,totalRows,]) 

  return (
    <div className="App">
      <p>{controller} </p>  
      <br />
      <div className='containerInput'>
      <p>Rango de Precios: </p>
        <input
          className="form-control inputBuscar"
          value={precioIni}
          placeholder={("Precio Min ")}
          onChange={handleChangePrecioMin}          
        />
        -
        <input
          className="form-control inputBuscar"
          value={precioFin}
          placeholder={("Precio Max ")}
          onChange={handleChangePrecioFin}
        />
        <div className='Row'>
      <Button className='inputBuscar' onClick={() => filtrarRangoPrecio()}>Buscar</Button>
      </div>
      </div>
      <br />
      <div className="containerInput">
      <Box  sx={{ minWidth: 120, position: 'absolute',left: -1 } }>
        <FormControl fullWidth >
          <Select
            value={pageSize}
            onChange={handleChangeSelectSimple}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>  
      </Box>
      <p>Buscar: </p>
        <input
          className="form-control inputBuscar"
          value={busqueda}
          placeholder={("Buscar por "+columnName1)}
          onChange={handleChangeSearchBar}
        />
      </div>
            
      <br />
     
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{columnName1}</TableCell>
              <TableCell>{columnName2}</TableCell>
              <TableCell>{columnName3}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPaginacion.map(model => (
              <TableRow key={model[keyTable]}>
                <TableCell>{model[columnName1]}</TableCell>
                <TableCell>{model[columnName2]}</TableCell>
                <TableCell>
                  <Edit className={styles.iconos} onClick={() => selectMap(model, 'Editar')}></Edit>
                  &nbsp;&nbsp;&nbsp;
                  <Delete className={styles.iconos} onClick={() => selectMap(model, 'Eliminar')}></Delete>
                  &nbsp;&nbsp;&nbsp;
                  <Clear className={styles.iconos} onClick={() => selectMap(model, 'Deshabilitar')}></Clear>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p>{initialRow} a {finalRow} de {totalRows} filas</p>
      <Stack spacing={2}>
      <Pagination count={necessaryPages} color="primary" page={actualPage} onChange={handleChangePagination} />
      </Stack>
      <Modal
        open={modalInsertar}  
        onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>
      <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
      <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
      <Modal
        open={modalDeshabilitar}
        onClose={abrirCerrarModalDeshabilitar}>
        {bodyDeshabilitar}
      </Modal>
    </div>
  );
}

export default App ;
