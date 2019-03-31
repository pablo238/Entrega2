const hbs = require('hbs');
const fs = require('fs');
listaCursos = [];
listaUsuarios = [];
listaCxU = [];

const listarC = () => {
    try {
        listaCursos = require('../../cursos.json')
    } catch (error) {
        listaCursos = [];
    }
}

const listarU = () => {
    try {
        listaUsuarios = require('../../usuarios.json')
    } catch (error) {
        listaUsuarios = [];
    }
}

const listarCxU = () => {
    try {
        listaCxU = require('../../CursoxUsuario.json')
    } catch (error) {
        listaCxU = [];
    }
}

const guardarC = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('cursos.json', datos, (err) => {
        if (err) throw (err);
        console.log('Cursos guardados con exito')
    })
}

const guardarU = () => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile('usuarios.json', datos, (err) => {
        if (err) throw (err);
        console.log('Usuarios guardados con exito')
    })
}

const guardarCxU = () => {
    let datos = JSON.stringify(listaCxU);
    fs.writeFile('CursoxUsuario.json', datos, (err) => {
        if (err) throw (err);
        console.log('Cursos por usuario guardados con exito')
    })
}

const crearC = (curso) => {

    listarC();
    let curs = {
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        modalidad: curso.modalidad,
        id: curso.id,
        valor: curso.valor,
        intensidad: curso.intensidad,
        estado: 'Disponible'

    };
    let duplicado = listaCursos.find(cur => cur.id == curso.id)
    if (!duplicado) {
        listaCursos.push(curs);
        guardarC();
        return (`<div class="alert alert-success" role="alert">Curso creado con exito</div>`);
    } else
        return ('<div class="alert alert-danger" role="alert">Ya existe otro curso con este id</div>');

}

const crearU = (user) => {
    listarC();
    listarU();
    listarCxU();
    let us = {
        documento: user.documento,
        correo: user.correo,
        nombre: user.nombre,
        telefono: user.telefono,

    };

    let userPerCourse = {
        documento: user.documento,
        curso: ((user.curso).split('---'))[0]
    };
    let duplicado = listaUsuarios.find(use => use.documento == user.documento)
    if (!duplicado) {
        listaUsuarios.push(us);
        guardarU();
        listaCxU.push(userPerCourse);
        guardarCxU();
        return (
        `<div class="alert alert-success" role="alert">
            Se crea usuario con exito y se registra en el curso
        </div>`)
    } else {
        let cursoduplicado = listaCxU.find(cpu => (cpu.curso == userPerCourse.curso && cpu.documento == userPerCourse.documento))
        if (!cursoduplicado) {
            listaCxU.push(userPerCourse);
            guardarCxU();
           return (`
           <div class="alert alert-warning" role="alert">
            Ya existe el usuario con este documento registrado,Pero se registra en el curso
            </div>
            `)
        } else {
            return (
                `<div class="alert alert-danger" role="alert">
                Ya existe el usuario con este documento registrado y con este curso registrado
            </div>`);
        }
    }


}

const cambiarEstadoC=(curso)=>{
    listarC();
    listaCursos.filter(x=> x.id==curso.id)[0].estado=curso.estado;
    guardarC();
}

const eliminarUsuarioDeCurso=(usuario)=>{
    listarCxU();
    let posicion=listaCxU.filter(p=> (p.documento==usuario.documento && p.id==usuario.id))
    listaCxU.splice(posicion,1);
    guardarCxU();
}
hbs.registerHelper('listaCursos', () => {
    listarC();
    text = ""
    let disponibles = listaCursos.filter(curs => curs.estado == 'Disponible');
    if (disponibles.length == 0) {
        text = ""
    } else {
        disponibles.forEach(cur => {
            text = text + `
            <option id='${cur.id}'>${cur.id}---${cur.nombre}</option>
        `})

    }
    
    return text;

})

hbs.registerHelper('listarCDisponibles', () => {
    listarC();
    let text = '<div class="accordion" id="accordionExample">';
    let i = 1;
    let disponibles = listaCursos.filter(curs => curs.estado == 'Disponible');
    if (disponibles.length == 0) {
        text = "<p>No se han registrado Cursos</p>"
    } else {
        disponibles.forEach(cur => {
            text = text +
                `<div class="card">
             <div class="card-header" id="heading${i}">
               <h2 class="mb-0">
                 <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                 Nombre de el curso: ${cur.nombre}<br> 
                 Descripcion del curso: ${cur.descripcion}<br>
                 Valor del Curso: ${cur.valor}<br>
                 </button>
               </h2>
             </div>
         
             <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
               <div class="card-body">
               Descripcion del curso: ${cur.descripcion}<br>
               Modalidad del curso: ${cur.modalidad}<br>
               Intensidad del Curso: ${cur.intensidad} <br> 
    
               </div>
             </div>
             </div>
        `
            i++;
        });
    }
    text = text + '</div>'
    return text;

});

hbs.registerHelper('gestionarCurso', () => {
    listarC();
    listarU();

    let text = '<div class="accordion" id="accordionExample">';
    let i = 1;
    listaCursos.forEach(x => {
        if (x.estado=='Disponible') {
            color='success'
        } else {
            color='danger'
        }
        personas = personasEnCurso(x);
        text = text +
            `<div class="card text-${color} border-${color}">
        <div class="card-header" id="heading${i}">
          <h2 class="mb-0">
          <form method="post"   action="/gestionCurso">
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
            Nombre de el curso
            <div class="form-group">
            <input type="text" name='nombre' readonly class="form-control-plaintext" id="staticEmail" value="${x.nombre}">
            </div>
            <div class="form-group">
            <input type="text" name='id' hidden readonly class="form-control-plaintext" id="staticEmail" value="${x.id}">
            </div>
            </button>
          </h2>
          
            <div class="form-group">
                <label for="estadoCurso">Estado del curso</label>
                    <select class="form-control" id="estadoCurso" name="estado">
                        <option>Disponible</option>
                        <option>Cerrado</option>
                    </select>
            </div>
            
            <button type="submit" class="btn btn-primary">Cambiar estado</button>
        </form>
        </div>
    
        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
          <div class="card-body">
          ${personas}
          </div>
        </div>
        </div>
   `
        i++;
    });

    return text + '</div>';
});

const personasEnCurso = (curso) => {

    listarCxU();
    listarU();
    let inscritos = listaCxU.filter(pers => pers.curso == curso.id);
    resultado = `<table class="table">
    <thead class="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Id</th>
        <th scope="col">Accion</th>
      </tr>
    </thead>
    <tbody>`
    i = 1;
    inscritos.forEach(curxx => {
        let persona = listaUsuarios.filter(perx => curxx.documento == perx.documento);
        resultado = resultado +
            ` <form method="post"   action="/gestionCurso">
            <input type="text" name='id' hidden readonly class="form-control-plaintext" id="staticEmail" value="${curso.id}">
            <tr>
            <th scope="row">${i}</th>
                <td>
                    <input type="text" name='nombre' readonly class="form-control-plaintext" id="staticEmail" value="${persona[0].nombre}">
                </td>
                <td>
                    <input type="text" name='documento' readonly class="form-control-plaintext" id="staticEmail" value="${persona[0].documento}">
                </td>
            <td><button type="submit" class="btn btn-danger">Eliminar</button></td>
          </tr>
          </form>`
        i++;

    });
    resultado = resultado + `</tbody>
    </table>`

    return resultado;
}
module.exports = {
    crearC,
    crearU,
    cambiarEstadoC,
    eliminarUsuarioDeCurso
}