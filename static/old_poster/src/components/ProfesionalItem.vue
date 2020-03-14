<template>
<a-card hoverable class="professional-item">
  <a-row type="flex" justify="space-between">
    <a-col :span="5">
      <a-row>
        <img class="avatar" alt="" :src="professional.avatar">
      </a-row>
      <a-row>
        <a-rate :defaultValue="0" v-model="trabajo.rate" disabled />
      </a-row>
    </a-col>
    <a-col :span="19">
      <a-row style="height: 148px;">
        <h2>{{professional.name.firstName}} - {{professional.name.lastName}}</h2>
        <p>{{professional.job.title}} - <span>{{professional.job.type}}</span></p>
        <p style="margin: 0px">{{professional.bio | limit(240) }}</p>
      </a-row>
      <a-row type="flex" justify="space-around" align="middle" class="details">
        <a-col :span="8">
          <p>Contratado: {{trabajo.contratado}}</p>
        </a-col>
        <a-col :span="8"></a-col>
        <a-col :span="8">
          <a-button type="primary" style="background-color: #086b94; border-color: #00425d;">Contactar</a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</a-card>
</template>

<script>
import Avatas from "./../mixing/avatar.js";

export default {
  name: "c2-profesional-item",
  data() {
    return {
      professional: {
        // avatar: this.$faker.internet.avatar(),
        // avatar: this.$faker.image.avatar(),
        avatar:
          "/img/avatars/" +
          Avatas[this.$faker.random.number(Avatas.length - 1)],
        email: this.$faker.internet.email(),
        user: this.$faker.internet.userName(),
        name: {
          firstName: this.$faker.name.firstName(),
          lastName: this.$faker.name.lastName(),
        },
        address: {
          city: this.$faker.address.city(),
          state: this.$faker.address.state(),
        },
        bio: this.$faker.lorem.paragraph(),
        phone: this.$faker.phone.phoneNumber(),
        job: {
          subTitle: this.$faker.name.title(),
          title: this.$faker.name.jobTitle(),
          descriptor: this.$faker.name.jobDescriptor(),
          area: this.$faker.name.jobArea(),
          type: this.$faker.name.jobType(),
        },
      },
      trabajo: {
        contratado: this.$faker.random.number(1000),
        rate: this.$faker.random.number(5),
      },
    };
  },
  computed: {},
  mounted() {},
};
</script>

<style scoped>
.professional-item img.avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  margin: 10px;
}

.professional-item .details {
  height: 30px;
}

.professional-item .details p {
  margin: 3px 0 0 0;
}

.professional-item .details a-col {
  align-items: center;
  display: flex;
  height: 100%;
}
.professional-item.ant-card.ant-card-bordered.ant-card-hoverable
  div.ant-card-body {
  padding: 6px !important;
}
</style>
