import { Button, Form, Alert, FormFloating, Row, Col, Card } from 'react-bootstrap';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { PageProps } from '@/types';
import { GenderUser } from '@/Helpers/enum';
import { getGenderLabel } from '@/Helpers/EnumHelper';
import { FaPencil } from 'react-icons/fa6';

type UpdateProfileInformationTypes = {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
};

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = '',
}: UpdateProfileInformationTypes) {
  const user = usePage<PageProps>().props.auth.user;
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: user.name,
      email: user.email,
      gender: user.gender || '',
      pbirth: user.pbirth || '',
      dbirth: user.dbirth || '',
      nik: user.nik || '',
      kk: user.kk || '',
      sim: user.sim || '',
      avatar: null as unknown as File,
      address: user.address || '',
      phone: user.phone || '', // Added phone field
    });

  // Generate Google API avatar URL based on email or name
  const getGoogleAvatar = () => {
    // Use user's email for Gravatar if available
    if (user.avatar) {
      return user.avatar; // Use existing avatar if already set
    } else {
      // Generate avatar from Google API using name
      const name = encodeURIComponent(data.name || 'User');
      // Using Google's UI Avatars API with name
      return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=150`;
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (avatar) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== 'avatar' || (key === 'avatar' && avatar)) {
          formData.append(key, data[key as keyof typeof data]);
        }
      });

      if (avatar) {
        formData.append('avatar', avatar);
      }

      patch(route('profile.update'), {
        data: formData,
        forceFormData: true,
      });
    } else {
      patch(route('profile.update'));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return (
    <section className={className}>
      <header>
        <h2 className="h5">Informasi Profil</h2>
        <p className="small text-muted">
          Perbarui informasi profil dan alamat email Anda.
        </p>
      </header>

      <Form onSubmit={submit} className="mt-4">
        <Row className='g-3'>
          <Col md={3} className="mb-4">
            <div className="text-center">
              <div className="position-relative d-inline-block" style={{ aspectRatio: '1/1' }}>
                <img
                  src={avatarPreview || getGoogleAvatar()}
                  alt={data.name}
                  className="rounded-circle img-thumbnail"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', aspectRatio: '1/1' }}
                />
                <div className="bottom-0 position-absolute end-0">
                  <label htmlFor="avatar-upload" className="btn btn-sm btn-primary rounded-circle" style={{ aspectRatio: '1/1' }}>
                    <FaPencil />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
              <p className="mt-2 small text-muted">Foto Profil</p>
              {errors.avatar && <div className="text-danger small">{errors.avatar}</div>}
            </div>
          </Col>

          <Col md={9}>
            <Row className='g-3'>
              <Col md={12}>
                <Card.Header className="px-0 pt-0 pb-2 mb-3 bg-white fw-bold border-bottom">Identitas</Card.Header>

                <FormFloating>
                  <Form.Control
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    isInvalid={!!errors.name}
                    placeholder="name"
                    autoComplete="name"
                    maxLength={50}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                  <Form.Label>Nama Lengkap</Form.Label>
                </FormFloating>
              </Col>

              <Col md={12}>
                <FormFloating>
                  <Form.Control
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    isInvalid={!!errors.phone}
                    placeholder="Nomor Telepon"
                    maxLength={15}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                  <Form.Label>Nomor Telepon</Form.Label>
                </FormFloating>
              </Col>

              <Col md={12}>
                <FormFloating>
                  <Form.Control
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    isInvalid={!!errors.email}
                    placeholder="Email"
                    autoComplete="username"
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  <Form.Label>Email</Form.Label>
                </FormFloating>
              </Col>

              <Col md={12}>
                <FormFloating>
                  <Form.Select
                    value={data.gender}
                    onChange={(e) => setData('gender', e.target.value)}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    {Object.values(GenderUser).map((gender) => (
                      <option key={gender} value={gender}>
                        {getGenderLabel(gender)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                  <Form.Label>Jenis Kelamin</Form.Label>
                </FormFloating>
              </Col>

              <Col md={12}>
                <Card.Header className="px-0 pt-2 pb-2 bg-white fw-bold border-bottom">Tanggal Lahir</Card.Header>
              </Col>

              <Col md={4}>
                <FormFloating>
                  <Form.Control
                    type="text"
                    value={data.pbirth}
                    onChange={(e) => setData('pbirth', e.target.value)}
                    isInvalid={!!errors.pbirth}
                    placeholder="Tempat Lahir"
                    maxLength={60}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pbirth}
                  </Form.Control.Feedback>
                  <Form.Label>Tempat Lahir</Form.Label>
                </FormFloating>
              </Col>

              <Col md={8}>
                <FormFloating>
                  <Form.Control
                    type="date"
                    value={data.dbirth}
                    onChange={(e) => setData('dbirth', e.target.value)}
                    isInvalid={!!errors.dbirth}
                    placeholder="Tanggal Lahir"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dbirth}
                  </Form.Control.Feedback>
                  <Form.Label>Tanggal Lahir</Form.Label>
                </FormFloating>
              </Col>

              <Col md={12}>
                <Card.Header className="px-0 pt-2 pb-2 bg-white fw-bold border-bottom">Identitas Pengemudi</Card.Header>
              </Col>

              <Col md={4}>
                <FormFloating>
                  <Form.Control
                    type="text"
                    value={data.nik}
                    onChange={(e) => setData('nik', e.target.value)}
                    isInvalid={!!errors.nik}
                    placeholder="NIK"
                    maxLength={16}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nik}
                  </Form.Control.Feedback>
                  <Form.Label>NIK (Nomor Induk Kependudukan)</Form.Label>
                </FormFloating>
              </Col>

              <Col md={4}>
                <FormFloating>
                  <Form.Control
                    type="text"
                    value={data.kk}
                    onChange={(e) => setData('kk', e.target.value)}
                    isInvalid={!!errors.kk}
                    placeholder="Nomor KK"
                    maxLength={16}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.kk}
                  </Form.Control.Feedback>
                  <Form.Label>Nomor Kartu Keluarga</Form.Label>
                </FormFloating>
              </Col>

              <Col md={4}>
                <FormFloating>
                  <Form.Control
                    type="text"
                    value={data.sim}
                    onChange={(e) => setData('sim', e.target.value)}
                    isInvalid={!!errors.sim}
                    placeholder="Nomor SIM"
                    maxLength={12}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sim}
                  </Form.Control.Feedback>
                  <Form.Label>Nomor SIM</Form.Label>
                </FormFloating>
              </Col>

              <Col md={12}>
                <Card.Header className="px-0 pt-2 pb-2 bg-white fw-bold border-bottom">Alamat Lengkap</Card.Header>
              </Col>

              <Col md="12">
                <FormFloating>
                  <Form.Control
                    as="textarea"
                    cols={10}
                    style={{ height: '150px' }}
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    isInvalid={!!errors.address}
                    placeholder="Alamat"
                    maxLength={255}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                  <Form.Label>Alamat</Form.Label>
                </FormFloating>
              </Col>
            </Row>

            {mustVerifyEmail && user.email_verified_at === null && (
              <div className="mt-2">
                <p className="small text-muted">
                  Alamat email Anda belum diverifikasi.
                  <Link
                    href={route('verification.send')}
                    method="post"
                    as="button"
                    className="p-0 ms-1 btn btn-link text-muted"
                  >
                    Klik disini untuk mengirimkan email verifikasi lagi.
                  </Link>
                </p>

                {status === 'verification-link-sent' && (
                  <Alert variant="success" className="mt-2">
                    Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
                  </Alert>
                )}
              </div>
            )}

            <div className="gap-3 mt-3 d-flex align-items-center">
              <Button type="submit" variant="primary" disabled={processing}>
                Simpan
              </Button>

              {recentlySuccessful && (
                <Alert variant="success" className="py-2 mb-0">
                  Tersimpan.
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Form>
    </section>
  );
}

