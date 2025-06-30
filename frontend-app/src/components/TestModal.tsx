import {useLayoutEffect, useRef, useState }  from 'react'
import { yupResolver } from '@hookform/resolvers/yup';

import {
    Modal,
    type ModalRef,
    showModal,
    IxModalHeader,
    IxModalContent,
    IxModalFooter,
    IxInput,
    IxLayoutAuto,
    IxNumberInput,
    IxButton,
} from '@siemens/ix-react'
import { useCreateClient, useGetClients } from '../api/fastAPI';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';


const validationSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    score: yup
      .number()
      .max(10, 'La calificación debe ser igual o menor a 10'),
  });

export function TestModal(){
    const {data, refetch } = useGetClients()
    const modalRef = useRef<ModalRef>(null)
    const createClient = useCreateClient()


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        trigger,
        setValue,
      } = useForm({
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {
          name: 'Cliente',
          score: 10,
        },
        resolver: yupResolver(validationSchema),
      });

      useLayoutEffect(() => {
        // Do instant validation after rendering
        trigger();
      }, [trigger]);

      const onSubmit = (data: any) => {
        console.log(data);
        createClient.mutate(
            {data: data},
            {
                onSuccess: () => {
                    modalRef.current?.close(null)
                    refetch()
                }
            }
        )
      };

    const open =() => {
        showModal({
            size:"600",
            content: (
                <Modal ref={modalRef}>
                    <IxModalHeader>Crear cliente</IxModalHeader>
                    <IxModalContent>
                        <form id="client-form" onSubmit={handleSubmit(onSubmit)} >
                            <IxLayoutAuto>
                                <IxInput
                                    label="Name"
                                    {...register('name')}
                                    className={clsx({ 'ix-invalid': errors.name })}
                                    invalidText={errors.name?.message}
                                    required
                                />
                                <IxNumberInput
                                    label="Calificacion"
                                    data-colspan="1"
                                    helperText="CAlificación maxima es 10"
                                    {...register('score', { required: false, max: '10' })}
                                    className={clsx({ 'ix-invalid': errors.score })}
                                    invalidText={errors.score?.message}
                                ></IxNumberInput>
                            </IxLayoutAuto>
                        </form>
                    </IxModalContent>
                        <IxModalFooter>
                        <IxButton onClick={()=> modalRef.current?.close(null)}>
                            Cerrar
                        </IxButton>
                        <IxButton type="submit" form="client-form" style={{ marginLeft: '0.5rem' }}>
                            Crear
                        </IxButton>
                    </IxModalFooter>
                </Modal>
            )
        })
    }
    const clients = data?.data ?? []
    return (
        <>
            <IxButton onClick={() => open()}>abre modal</IxButton>
            <table className="ix-table ix-table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Calificacion</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(w => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>{w.name}</td>
              <td>{w.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </>
    )
}