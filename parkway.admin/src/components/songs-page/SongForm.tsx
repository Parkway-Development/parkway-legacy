import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Song } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import TextArea from 'antd/lib/input/TextArea';
import { convertFromStringArray, convertToStringArray } from '../../utilities';
import SongArrangementsTable from './SongArrangementsTable.tsx';

type SongWithoutId = Omit<Song, '_id'>;

type SongFormProps = AddBaseApiFormProps<Song> & {
  initialValues?: SongWithoutId;
};

type FlattenedSongWithoutId = Omit<SongWithoutId, 'artists' | 'copyrights'> & {
  artists: string;
  copyrights: string;
};

const SongForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: SongFormProps) => {
  const [form] = Form.useForm<FlattenedSongWithoutId>();

  const initialValues = initialValuesProp
    ? {
        ...initialValuesProp,
        artists: convertFromStringArray(initialValuesProp.artists),
        copyrights: convertFromStringArray(initialValuesProp.copyrights)
      }
    : undefined;

  const handleSave = (values: FlattenedSongWithoutId) => {
    const finalValues: SongWithoutId = {
      ...values,
      artists: convertToStringArray(values.artists),
      copyrights: convertToStringArray(values.copyrights),
      arrangements: values.arrangements ?? []
    };

    onSave(finalValues);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/songs">Songs</Link>
          },
          {
            title: initialValues ? 'Edit Song' : 'Add Song'
          }
        ]}
      />
      <Form<FlattenedSongWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<FlattenedSongWithoutId>
          label="Title"
          name="title"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<FlattenedSongWithoutId> label="Subtitle" name="subtitle">
          <Input />
        </Form.Item>

        <Form.Item<FlattenedSongWithoutId> label="Tempo" name="tempo">
          <Input type="number" step={1} />
        </Form.Item>

        <Form.Item<FlattenedSongWithoutId>
          label="Time Signature"
          name="timeSignature"
        >
          <Input />
        </Form.Item>

        <Form.Item<FlattenedSongWithoutId> label="Artists" name="artists">
          <TextArea />
        </Form.Item>

        <Form.Item<FlattenedSongWithoutId>
          label="CCLI License"
          name="ccliLicense"
        >
          <Input />
        </Form.Item>

        <Form.Item<FlattenedSongWithoutId> label="Copyrights" name="copyrights">
          <TextArea />
        </Form.Item>

        <Form.Item<FlattenedSongWithoutId>
          label="Arrangements"
          name="arrangements"
        />
        <SongArrangementsTable
          songArrangements={initialValues?.arrangements}
          onUpdate={(songArrangements) =>
            form.setFieldsValue({ arrangements: songArrangements })
          }
        />

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={onCancel}
        />
      </Form>
    </>
  );
};

export default SongForm;
