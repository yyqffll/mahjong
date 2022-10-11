<template>
  <div class="chat">
    <div class="contact-person-list">
      <van-pull-refresh v-model="contactPersonSearchLoading" @refresh="contactPersonListRefresh">
        <van-list
          v-model:loading="contactPersonListLoading"
          :finished="contactPersonListFinished"
          finished-text="没有更多了"
          offset="200"
          @load="getContactPersonList"
        >
          <van-cell
            class="contact-person"
            :class="{'contact-person-inline': item.userStatus === 'loginIn', 'choose-contact-person': item.userName === contactPerson}"
            v-for="item in contactPersonList"
            :key="item.userId"
            @click="chooseContactPerson(item)"
          >
            <span class="light"></span>
            <span>{{item.userName}}</span>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="chat-main">
      <div class="contact-person">
        <eye id="contactPersonfEye" :canChangeStatus="false" :target="contactPerson"></eye>
      </div>
      <div class="myself">
        <eye id="myselfEye" :target="contactPerson"></eye>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import eye from '@/components/eye'
export default {
  name: 'chat',
  components: {
    eye
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const contactPersonModel = reactive({
      contactPerson: '',
      contactPersonSearchLoading: false,
      contactPersonListLoading: false,
      contactPersonListFinished: false,
      contactPersonParams: {
        page: 1,
        rows: 10,
        userName: store.state.userName
      },
      contactPersonList: [],
      contactPersonTotal: 0,
      getContactPersonList: (refresh = false) => {
        return new Promise((resolve) => {
          const page = refresh ? 1 : contactPersonModel.contactPersonList.length / 10 + 1
          proxy.$axios({
            url: '/ecapi/user/find',
            data: Object.assign({}, contactPersonModel.contactPersonParams, { page })
          }).then(res => {
            resolve(res)
            contactPersonModel.contactPersonListLoading = false
            refresh ? contactPersonModel.contactPersonList = res.data.data : contactPersonModel.contactPersonList = contactPersonModel.contactPersonList.concat(res.data.data)
            contactPersonModel.contactPersonTotal = res.data.total
            if (contactPersonModel.contactPersonList.length >= contactPersonModel.contactPersonTotal) {
              contactPersonModel.contactPersonListFinished = true
            } else {
              contactPersonModel.contactPersonListFinished = false
            }
          })
        })
      },
      contactPersonListRefresh: () => {
        contactPersonModel.contactPersonSearchLoading = true
        contactPersonModel.getContactPersonList(true).then(() => {
          contactPersonModel.contactPersonSearchLoading = false
        })
      },
      chooseContactPerson: (item) => {
        contactPersonModel.contactPerson = item.userName
      }
    })
    const toJyListQueryModel = toRefs(contactPersonModel)
    return {
      ...toJyListQueryModel
    }
  }
}
</script>

<style lang="less" scoped>
.chat {
  display: flex;
  height: 100%;
  .contact-person-list {
    width: 28%;
    height: 100%;
    background: #fff;
    .van-pull-refresh {
      height: 100%;
      ::-webkit-scrollbar {
        width: 0 !important;
      }
      .van-list {
        height: 100%;
        overflow-y: auto;
        .contact-person {
          width: calc(100%);
          height: 13%;
          padding-left: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border-bottom: 1px solid #b5b2b2;
          /deep/ .van-cell__value {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .light {
            display: inline-block;
            margin-right: 16px;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background: #b5b2b2;
          }
        }
        .contact-person-inline {
          .light {
            background: #38b638;
          }
        }
        .choose-contact-person {
          background: #e6e5e5;
        }
      }
    }
  }
  .chat-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    background: black;
    // border-top: 1px solid #fff;
    .contact-person,
    .myself {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      position: relative;
      // background: black;
      /deep/.fun-group {
        margin-top: 32px;
        .van-button {
          margin: 0 16px;
        }
      }
    }
    .contact-person {
      height: calc(26% - 1px);
      border-bottom: 1px solid #fff;
    }
    .myself {
      flex: 1;
    }
  }
}
</style>
