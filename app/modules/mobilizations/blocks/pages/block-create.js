import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import ReactS3Uploader from 'react-s3-uploader'

import * as Paths from '../../../../scripts/Paths'
import {
  setSelectedLayout,
  progressUploadBlockBackgroundImage,
  finishUploadBlockBackgroundImage,
  setUploadedBlockBackgroundImage
} from '../../../../scripts/Block/BlockActions'
import { Tabs, Tab } from '../../../../components/Navigation'
import ColorPicker from '../../../../components/ColorPicker'
import { actions as blockActions, constants as c } from '../../../mobilizations/blocks'
import { BlockMiniature } from '../../../mobilizations/blocks/components'

const { asyncBlockCreate } = blockActions

import '../../../mobilizations/blocks/pages/scss/block-create.scss'

export class BlockCreate extends Component {
  componentWillReceiveProps(nextProps) {
    const { blocks, mobilization } = this.props

    if (blocks.data.length !== nextProps.blocks.data.length) {
      const { router } = this.context
      router.transitionTo(`${Paths.editMobilization(mobilization.id)}?newBlock=true`)
    }
  }

  render() {
    const {
      dispatch,
      auth,
      selectedColor,
      mobilization,
      location,
      selectedLayout,
      bgImage,
      uploadedBackgroundImage,
      isBlockBackgroundImageUploading
    } = this.props
    const { color_scheme: colorScheme } = mobilization
    const newBlockPath = Paths.newMobilizationBlock(mobilization.id)

    return (
      <div className="block-create col-12 flex flex-column bg-silver gray relative pl4">
        <div className="block-create-header bg-white pt3 pr4 pl5">
          <h1 className="h1 mt0 mb3">Adicione um bloco de conteúdo</h1>
          <Tabs>
            <Tab
              path={newBlockPath}
              text="Blocos em branco"
              isActive={newBlockPath === location.pathname}
            />
          </Tabs>
        </div>


        <div className="clearfix overflow-auto">
          <div className="col-6 clearfix py3 pr4 pl5">
            <p className="lightgray mb2">
              Os blocos serão adicionados ao fim da sua página, mas você pode trocá-los de ordem a
              qualquer momento
            </p>

            <label className="block-type bold mb1 block gray20">
              Tipo de bloco
            </label>
            <div className="mxn1 clearfix">
              {c.BLOCK_LAYOUTS.map((layout, index) => (
                <BlockMiniature
                  key={index}
                  layout={layout}
                  selectedLayout={selectedLayout}
                  onClick={() => { dispatch(setSelectedLayout(layout)) }}
                />
              ))}
            </div>


            <label className="block-type bold mb1 block gray20">
              Fundo
            </label>
            <div className="col-12">
              <ColorPicker
                dispatch={dispatch}
                theme={colorScheme.replace('-scheme', '')}
                className="left"
              />
              <div
                className={
                  'border border-gray94 rounded p2 bg-white center relative'
                  + ' overflow-hidden inline-block'
                }
              >
                <div className="clearfix" style={{ width: '240px' }}>
                  {
                    bgImage || uploadedBackgroundImage ? (
                      <div
                        className="bg-cover square"
                        style={{ backgroundImage: `url(${bgImage || uploadedBackgroundImage})` }}
                      />
                    ) : (
                      <div className="square-float">
                        <i
                          className="fa fa-image silver"
                          style={{ fontSize: '7em', marginTop: '2.5rem' }}
                        />
                      </div>
                    )
                  }
                  <div className={bgImage || uploadedBackgroundImage ? 'hide' : null}>
                    <div className="mb1 gray">Selecione a imagem de fundo</div>
                  </div>
                  <div className="overflow-hidden">
                    {
                      isBlockBackgroundImageUploading
                      ? <i className="fa fa-spin fa-refresh" />
                      : <ReactS3Uploader
                        id="blockBackgroundImage"
                        signingUrl={`${process.env.API_URL}/uploads`}
                        accept="image/*"
                        onProgress={() =>
                          !isBlockBackgroundImageUploading &&
                            dispatch(progressUploadBlockBackgroundImage())
                        }
                        onFinish={image => {
                          const imageUrl = image.signedUrl.substring(0, image.signedUrl.indexOf('?'))
                          dispatch(setUploadedBlockBackgroundImage(imageUrl))
                          dispatch(finishUploadBlockBackgroundImage())
                        }}
                        className="border-none bg-darken-4 rounded p1 white"
                        style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: '1rem',
                          width: '80%',
                          marginLeft: '-40%'
                        }}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>

            <button
              className="block-create-button btn float-btn-menu rounded"
              onClick={() => {
                const action = asyncBlockCreate({
                  mobilization,
                  block: {
                    bg_class: JSON.stringify(selectedColor),
                    bg_image: uploadedBackgroundImage || bgImage,
                    widgets_attributes: selectedLayout.map(column => ({ kind: 'draft', ...column }))
                  }
                })
                dispatch(action)
                dispatch(setUploadedBlockBackgroundImage(null))
              }}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    )
  }
}

BlockCreate.contextTypes = {
  router: React.PropTypes.object
}

BlockCreate.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  blocks: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  mobilization: PropTypes.object.isRequired,
  selectedColor: PropTypes.object.isRequired,
  bgImage: PropTypes.string,
  selectedLayout: PropTypes.array.isRequired
}

BlockCreate.defaultProps = {
  selectedLayout: c.BLOCK_LAYOUTS[0],
  selectedColor: { r: 51, g: 51, b: 51, a: 1 },
  bgImage: null
}

const mapStateToProps = state => ({
  selectedLayout: state.blockReducer.selectedLayout,
  isBlockBackgroundImageUploading: state.blockReducer.isBlockBackgroundImageUploading,
  selectedColor: state.colorPicker.color,
  uploadedBackgroundImage: state.blockReducer.uploadedBackgroundImage
})

export default connect(mapStateToProps)(BlockCreate)
