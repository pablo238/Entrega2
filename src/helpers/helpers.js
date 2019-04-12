const hbs = require('hbs');
const Estudiante= require('./../models/estudiante')
const UserPerCourse= require('./../models/userPerCourse')
const Curso= require('./../models/curso')

const crearC = (curso) => {

    let curs  =new Curso( {
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        modalidad: curso.modalidad,
        id: curso.id,
        valor: curso.valor,
        intensidad: curso.intensidad,
        estado: 'Disponible'

    });
    
    Curso.find({id:curso.id}).exec((err,dup)=>{
        
        
    })
    console.log(this.duplicado)
    if (!duplicado) {
        curs.save((err,resultado)=>{
            if (err) {
                return console.log(err);
            }
        })
        
        return (`<div class="alert alert-success" role="alert">Curso creado con exito</div>`);
    } else
        return ('<div class="alert alert-danger" role="alert">Ya existe otro curso con este id</div>');
    
    
}

const crearU = (user) => {
    
    let estudiante =new Estudiante({
        documento: user.documento,
        correo: user.correo,
        nombre: user.nombre,
        telefono: user.telefono,

    });

    let userPerCourse =new UserPerCourse({
        documento: user.documento,
        curso: ((user.curso).split('---'))[0]
    });
    let duplicado;
    Estudiante.find({documento:user.documento}).exec((err,dup)=>{
        
        if (err) {
            return console.log(err)
        }
        duplicado=dup;
    })
        if (!duplicado) {
            estudiante.save((err,resultado)=>{
                if (err) {
                    return console.log(err)
                }
            })
            userPerCourse.save((err,resultado)=>{
                if (err) {
                    return console.log(err)
                }
            })
            return (
            `<div class="alert alert-success" role="alert">
                Se crea usuario con exito y se registra en el curso
            </div>`)
        } else {
            let cursoduplicado;
            UserPerCourseEstudiante.find({documento:userPerCourse.documento, curso:userPerCourse.curso}).exec((err,cursodup)=>{
                cursoduplicado=cursodup;
            })
                if (!cursoduplicado) {
                userPerCourse.save((err,resultado)=>{
                    if (err) {
                        return console.log(err)
                    }
                })
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
    Curso.findOneAndUpdate({id:curso.id},{estado:curso.estado},{new:true},(err,resultado)=>{
        if (err) {
            return console.log(err);
        }
    })  
}

const eliminarUsuarioDeCurso=(usuario)=>{
    UserPerCourse.findOneAndDelete({documento:usuario.documento,id:usuario.id},usuario,(err,resultado)=>{
        if (err) {
            return console.log(err);
        }
    })  
}

hbs.registerHelper('listaCursos', () => {
    text = ""
    let disponibles;
    Curso.find({estado : 'Disponible'}).exec((err,disp)=>{
        disponibles=disp;
    })
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
    let text = '<div class="accordion" id="accordionExample">';
    let i = 1;
    let disponibles;
    Curso.find({estado : 'Disponible'}).exec((err,disp)=>{
   disponibles=disp;
    })
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
    let text = '<div class="accordion" id="accordionExample">';
    let i = 1;
    let listaCursos;
    Curso.find({}).exec((err,listaCur)=>{
        listaCursos=listaCur;
    })
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

    let inscritos;
    UserPerCourse.find({curso :curso.id}).exec((err,inscri)=>{
     inscritos=inscri;
    })
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
        let persona;
        Estudiante.find({documento :curxx.documento}).exec((err,per)=>{
            persona=per;
        })
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